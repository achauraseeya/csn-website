export interface GithubSettings {
  enabled: boolean;
  username: string;
  repo: string;
  branch: string;
}

export function getGithubSettings(): GithubSettings {
  try {
    const stored = localStorage.getItem('chaurasiya_github_settings');
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return {
    enabled: true,
    username: 'achauraseeya',
    repo: 'csn-website',
    branch: 'main'
  };
}

export function saveGithubSettings(settings: GithubSettings) {
  localStorage.setItem('chaurasiya_github_settings', JSON.stringify(settings));
}

const getPat = () => 
  localStorage.getItem('chaurasiya_admin_password') || 
  localStorage.getItem('csn_github_pat') || 
  localStorage.getItem('github_pat') || 
  '';

async function fetchFileSha(path: string, settings: GithubSettings, pat: string): Promise<string | undefined> {
  const url = `https://api.github.com/repos/${settings.username}/${settings.repo}/contents/${path}?ref=${settings.branch}`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `token ${pat}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  if (res.ok) {
    const data = await res.json();
    return data.sha;
  }
  return undefined;
}


export async function uploadImageToGithub(fileName: string, base64Data: string, commitMessage: string): Promise<string> {
  const safeName = fileName.replace(/[^a-zA-Z0-9_.-]/g, '_');

  // Automatically compress image client-side to below 100 KB while preserving quality
  let processedBase64 = base64Data;
  try {
    processedBase64 = await new Promise<string>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Max dimensions safeguard for high-res photos
        const MAX_DIMENSION = 1600;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(base64Data);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Iteratively reduce quality until size is < 100KB (approx 102400 bytes)
        let quality = 0.90;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Estimate size in bytes from base64 string length
        while (dataUrl.length * 0.75 > 102400 && quality > 0.3) {
          quality -= 0.10;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(dataUrl);
      };
      img.onerror = () => resolve(base64Data);
      img.src = base64Data;
    });
  } catch (err) {
    console.warn('Image compression fallback used:', err);
  }

  let localUrl = '';

  // 1. Upload to local server image storage first
  try {
    const serverRes = await fetch('/api/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: safeName, base64Data: processedBase64 })
    });
    if (serverRes.ok) {
      const data = await serverRes.json();
      if (data.url) {
        localUrl = data.url;
      }
    }
  } catch (err) {
    console.warn('Server image upload endpoint unavailable, falling back:', err);
  }

  // 2. Also push to GitHub if PAT is provided and enabled
  const settings = getGithubSettings();
  const pat = getPat();

  if (settings.enabled && pat) {
    try {
      const base64Content = processedBase64.split(',')[1] || processedBase64;
      const primaryPath = `assets/uploads/${safeName}`;
      const url = `https://api.github.com/repos/${settings.username}/${settings.repo}/contents/${primaryPath}`;
      const sha = await fetchFileSha(primaryPath, settings, pat);

      fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${pat}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: commitMessage,
          content: base64Content,
          branch: settings.branch,
          ...(sha ? { sha } : {})
        })
      }).then(async (res) => {
        if (res.ok) {
          // Also sync to public/assets/uploads/ and public/uploads/ for static build compatibility
          pushContentToGithubRepo(`public/assets/uploads/${safeName}`, base64Content, commitMessage, settings, pat, true).catch(() => {});
          pushContentToGithubRepo(`public/uploads/${safeName}`, base64Content, commitMessage, settings, pat, true).catch(() => {});
        } else {
          const errTxt = await res.text().catch(() => '');
          console.error(`GitHub API image upload failed (${res.status}):`, errTxt);
        }
      }).catch((err) => {
        console.warn('GitHub image sync failed:', err);
      });
    } catch (err) {
      console.warn('GitHub image sync initialization failed:', err);
    }
  }

  // Return localUrl if available, otherwise return processedBase64 string as fallback
  return localUrl || processedBase64;
}

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUtf8(base64Str: string): string {
  const binary = atob(base64Str.replace(/\s/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder('utf-8').decode(bytes);
}

let saveQueue: Promise<any> = Promise.resolve();

export async function saveFileToGithub(path: string, content: any, commitMessage: string) {
  // Use a sequential queue to prevent SHA mismatch race conditions on simultaneous saves
  const currentSave = saveQueue.then(async () => {
    const cleanKey = path.replace(/\.json$/, '');

    // 1. Always save to server API first so all devices/visitors see updates instantly!
    try {
      await fetch(`/api/site-data/${cleanKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
    } catch (e) {
      console.warn('Failed to save to server site-data endpoint:', e);
    }

    // 2. Also save to GitHub repository if PAT is available
    const settings = getGithubSettings();
    const pat = getPat();
    if (!settings.enabled || !pat) return;

    try {
      const jsonStr = JSON.stringify(content, null, 2);
      const base64Content = utf8ToBase64(jsonStr);

      // A) Push to primary path in GitHub repo (e.g. abhishek_profile.json)
      await pushContentToGithubRepo(path, base64Content, commitMessage, settings, pat, true);

      // B) If path is a json file not in public/, also push to public/ path so static builds get it!
      if (path.endsWith('.json') && !path.startsWith('public/')) {
        await pushContentToGithubRepo(`public/${path}`, base64Content, commitMessage, settings, pat, true).catch(() => {});
      }
    } catch (err) {
      console.warn(`GitHub push failed for ${path}:`, err);
    }
  });

  saveQueue = currentSave.catch(() => {});
  return currentSave;
}

async function pushContentToGithubRepo(path: string, base64Content: string, commitMessage: string, settings: GithubSettings, pat: string, isRawBase64 = false) {
  const url = `https://api.github.com/repos/${settings.username}/${settings.repo}/contents/${path}`;
  const sha = await fetchFileSha(path, settings, pat);

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${pat}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: commitMessage,
      content: base64Content,
      branch: settings.branch,
      ...(sha ? { sha } : {})
    })
  });

  if (!res.ok) {
    console.warn(`Failed to save ${path} to GitHub: ${res.statusText}`);
  }
}

export async function apiFetch<T>(endpoint: string, fileName: string, fallbackData: T): Promise<T> {
  const cleanKey = fileName.replace(/\.json$/, '');
  const settings = getGithubSettings();
  const pat = getPat();

  // 1. Try local server API endpoint FIRST for instant real-time sync when hosted fullstack!
  try {
    const serverUrl = `/api/site-data/${cleanKey}?t=${Date.now()}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(serverUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data !== null && data !== undefined) {
        return data as T;
      }
    }
  } catch (err) {
    // Server unavailable or static deployment
  }

  // 2. Query GitHub REST API directly with raw media header FIRST for INSTANT live commit data (bypasses raw.githubusercontent.com 5-minute Fastly CDN cache!)
  if (settings.enabled && settings.username && settings.repo) {
    const candidatePaths = [fileName, `public/${fileName}`];
    
    for (const path of candidatePaths) {
      try {
        const url = `https://api.github.com/repos/${settings.username}/${settings.repo}/contents/${path}?ref=${settings.branch}&_cb=${Date.now()}`;
        const headers: Record<string, string> = {
          'Accept': 'application/vnd.github.v3.raw',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        };
        if (pat) {
          headers['Authorization'] = `token ${pat}`;
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(url, { headers, cache: 'no-store', signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const rawText = await res.text();
          const parsed = JSON.parse(rawText);
          if (parsed !== null && parsed !== undefined) {
            return parsed as T;
          }
        }
      } catch (e) {
        // Fall back to next path or raw url
      }
    }

    // 3. Secondary fallback to raw.githubusercontent.com
    const rawUrls = [
      `https://raw.githubusercontent.com/${settings.username}/${settings.repo}/${settings.branch}/${fileName}`,
      `https://raw.githubusercontent.com/${settings.username}/${settings.repo}/${settings.branch}/public/${fileName}`
    ];

    for (const rawUrl of rawUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const rawRes = await fetch(rawUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (rawRes.ok) {
          const data = await rawRes.json();
          if (data !== null && data !== undefined) {
            return data as T;
          }
        }
      } catch (e) {}
    }
  }

  // 3. Fallback to static relative URL from current domain (e.g., ./fileName.json)
  const relativeUrls = [
    `./${fileName}`,
    `/${fileName}`
  ];
  for (const relUrl of relativeUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(relUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('json') || relUrl.endsWith('.json')) {
          const data = await res.json();
          if (data !== null && data !== undefined) {
            return data as T;
          }
        }
      }
    } catch (e) {}
  }

  return fallbackData;
}

export async function apiSave<T>(
  endpoint: string,
  fileName: string,
  allUpdatedItems: T[],
  newItem: T,
  commitMessage: string,
  authHeaders?: Record<string, string>
): Promise<T[]> {
  await saveFileToGithub(fileName, allUpdatedItems, commitMessage);
  return allUpdatedItems;
}

export async function apiDelete<T extends { id: string }>(
  deleteEndpoint: string,
  fileName: string,
  itemsAfterDeletion: T[],
  commitMessage: string,
  authHeaders?: Record<string, string>
): Promise<T[]> {
  await saveFileToGithub(fileName, itemsAfterDeletion, commitMessage);
  return itemsAfterDeletion;
}

export async function triggerEntireRepoSync(): Promise<{ success: boolean; message: string; output?: string }> {
  try {
    const res = await fetch('/api/sync-github-repo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, message: data.message || 'Entire repository synced successfully!', output: data.output };
    } else {
      const err = await res.json().catch(() => ({ error: 'Sync failed' }));
      return { success: false, message: err.error || 'Server repo sync returned an error' };
    }
  } catch (e: any) {
    return { success: false, message: e.message || 'Failed to connect to repo sync service' };
  }
}
