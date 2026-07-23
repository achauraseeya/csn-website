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

export async function saveFileToGithub(path: string, content: any, commitMessage: string) {
  const settings = getGithubSettings();
  const pat = getPat();
  if (!settings.enabled || !pat) return;

  const url = `https://api.github.com/repos/${settings.username}/${settings.repo}/contents/${path}`;
  const sha = await fetchFileSha(path, settings, pat);

  const base64Content = btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2))));

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
    throw new Error(`Failed to save ${path} to GitHub: ${res.statusText}`);
  }
}

export async function apiFetch<T>(endpoint: string, fileName: string, fallbackData: T): Promise<T> {
  const settings = getGithubSettings();
  if (!settings.enabled) return fallbackData;

  try {
    const url = `https://raw.githubusercontent.com/${settings.username}/${settings.repo}/${settings.branch}/${fileName}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return data as T;
    }
  } catch (err) {
    console.warn(`GitHub fetch failed for ${fileName}:`, err);
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
