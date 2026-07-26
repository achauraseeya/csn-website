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

const getPat = () => localStorage.getItem('chaurasiya_admin_password') || '';

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
  const settings = getGithubSettings();
  const pat = getPat();
  if (!settings.enabled || !pat) throw new Error("GitHub sync is disabled or PAT is missing");
  
  // Extract pure base64 without data URL prefix (e.g., "data:image/jpeg;base64,...")
  const base64Content = base64Data.split(',')[1] || base64Data;
  
  const path = `assets/uploads/${fileName}`;
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
    throw new Error(`Failed to upload ${path} to GitHub: ${res.statusText}`);
  }

  // Use raw.githubusercontent for immediate viewing
  return `https://raw.githubusercontent.com/${settings.username}/${settings.repo}/${settings.branch}/${path}`;
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

export async function saveFileToGithub(path: string, content: any, commitMessage: string) {
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
    const url = `https://api.github.com/repos/${settings.username}/${settings.repo}/contents/${path}`;
    const sha = await fetchFileSha(path, settings, pat);

    const base64Content = utf8ToBase64(JSON.stringify(content, null, 2));

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
  } catch (err) {
    console.warn(`GitHub push failed for ${path}:`, err);
  }
}

export async function apiFetch<T>(endpoint: string, fileName: string, fallbackData: T): Promise<T> {
  const cleanKey = fileName.replace(/\.json$/, '');
  const settings = getGithubSettings();
  const pat = getPat();

  // 1. Try fetching directly from GitHub repository FIRST (Source of Truth)
  if (settings.enabled && settings.username && settings.repo) {
    // A) If Admin with PAT, try GitHub API contents endpoint with Auth header
    if (pat) {
      try {
        const url = `https://api.github.com/repos/${settings.username}/${settings.repo}/contents/${fileName}?ref=${settings.branch}&t=${Date.now()}`;
        const res = await fetch(url, {
          headers: {
            'Authorization': `token ${pat}`,
            'Accept': 'application/vnd.github.v3+json',
            'Cache-Control': 'no-cache'
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.content) {
            const contentStr = base64ToUtf8(data.content);
            return JSON.parse(contentStr) as T;
          }
        }
      } catch (e) {
        // Fallback to raw usercontent
      }
    }

    // B) For public users (or if authenticated API fetch failed), fetch raw file directly from GitHub repository!
    try {
      const rawUrl = `https://raw.githubusercontent.com/${settings.username}/${settings.repo}/${settings.branch}/${fileName}?t=${Date.now()}`;
      const rawRes = await fetch(rawUrl, { cache: 'no-store' });
      if (rawRes.ok) {
        const data = await rawRes.json();
        if (data !== null && data !== undefined) {
          return data as T;
        }
      }
    } catch (e) {
      // Fallback to jsDelivr or local server
    }

    // C) Fallback to jsDelivr CDN
    try {
      const cdnUrl = `https://cdn.jsdelivr.net/gh/${settings.username}/${settings.repo}@${settings.branch}/${fileName}?t=${Date.now()}`;
      const cdnRes = await fetch(cdnUrl, { cache: 'no-store' });
      if (cdnRes.ok) {
        const data = await cdnRes.json();
        if (data !== null && data !== undefined) {
          return data as T;
        }
      }
    } catch (e) {
      // Fallback
    }
  }

  // 2. Fallback to local server API endpoint if running in Express backend environment
  try {
    const serverUrl = `/api/site-data/${cleanKey}?t=${Date.now()}`;
    const res = await fetch(serverUrl);
    if (res.ok) {
      const data = await res.json();
      if (data !== null && data !== undefined) {
        return data as T;
      }
    }
  } catch (err) {
    // Ignore server fallback error
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
