const fs = require('fs');
const path = require('path');

const USERNAME = 'achauraseeya';
const REPO = 'csn-website';
const BRANCH = 'main';
const GITHUB_TOKEN = process.env.GITHUB_PAT || process.env.GITHUB_TOKEN;

async function fetchGithub(url) {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'CSN-Repo-Syncer'
  };
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }
  const res = await fetch(url, { headers });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`GitHub API error: ${res.status} ${res.statusText} for ${url}`);
  }
  return res.json();
}

async function downloadFile(url, targetPath) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to download ${url}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(targetPath, buffer);
  } catch (e) {
    console.error(`Error downloading ${url} to ${targetPath}:`, e.message);
  }
}

async function syncRecursive(gitPath = '') {
  console.log(`--- Syncing directory: ${gitPath || 'root'} ---`);
  const items = await fetchGithub(`https://api.github.com/repos/${USERNAME}/${REPO}/contents/${gitPath}?ref=${BRANCH}`);
  if (!items) return;

  const skipDirs = ['src', 'node_modules', '.github', '.git', 'dist'];

  for (const item of items) {
    if (item.type === 'dir') {
      if (!skipDirs.includes(item.name)) {
        await syncRecursive(item.path);
      }
    } else if (item.type === 'file') {
      const ext = path.extname(item.name).toLowerCase();
      
      // Local path relative to root
      const localPath = path.join(__dirname, item.path);
      await downloadFile(item.download_url, localPath);
      console.log(`Synced: ${item.path}`);

      // Mirroring logic for this specific project structure
      if (ext === '.json' || ext === '.xml') {
        const fileName = path.basename(item.path);
        const mirrors = [
          path.join(__dirname, 'public', fileName),
          path.join(__dirname, 'data_store', fileName),
          path.join(__dirname, 'dist', fileName),
          path.join(__dirname, 'dist', 'public', fileName)
        ];
        for (const mirror of mirrors) {
          if (mirror !== localPath) {
            const dir = path.dirname(mirror);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.copyFileSync(localPath, mirror);
          }
        }
      }
      
      // Additional mirroring for uploads
      if (item.path.includes('uploads')) {
        const fileName = path.basename(item.path);
        const uploadMirrors = [
           path.join(__dirname, 'public', 'uploads', fileName),
           path.join(__dirname, 'public', 'assets', 'uploads', fileName),
           path.join(__dirname, 'assets', 'uploads', fileName),
           path.join(__dirname, 'data_store', 'uploads', fileName)
        ];
        for (const mirror of uploadMirrors) {
          if (mirror !== localPath) {
            const dir = path.dirname(mirror);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.copyFileSync(localPath, mirror);
          }
        }
      }
    }
  }
}

async function run() {
  try {
    console.log('Starting full recursive GitHub sync...');
    await syncRecursive('');
    console.log('--- GitHub Entire Repo Sync Completed Successfully! ---');
  } catch (err) {
    console.error('Sync failed:', err);
  }
}

run();
