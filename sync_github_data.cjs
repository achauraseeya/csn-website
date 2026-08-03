const fs = require('fs');
const path = require('path');

const USERNAME = 'achauraseeya';
const REPO = 'csn-website';
const BRANCH = 'main';

const JSON_FILES = [
  'site_texts.json',
  'community_notices.json',
  'journey_albums.json',
  'community_events.json',
  'abhishek_profile.json',
  'community_members.json',
  'community_documents.json',
  'community_networks.json',
  'matrimonial_profiles.json',
  'volunteers.json',
  'membership_applications.json',
  'newsletter_subscribers.json',
  'custom_form_fields.json',
  'hidden_standard_fields.json',
  'member_categories.json',
  'notice_categories.json',
  'about_sections.json',
  'our_heritage.json',
  'renowned_people.json',
  'donation_info.json',
  'membership_info.json',
  'volunteer_info.json',
  'blogger_export.xml'
];

async function syncJsonAndDataFiles() {
  console.log('--- Starting Comprehensive Data & JSON Sync from GitHub ---');
  let syncedCount = 0;

  for (const file of JSON_FILES) {
    try {
      const url = `https://raw.githubusercontent.com/${USERNAME}/${REPO}/${BRANCH}/${file}?t=${Date.now()}`;
      const res = await fetch(url);
      if (!res.ok) {
        continue;
      }
      const rawText = await res.text();
      let parsedData;
      try {
        parsedData = JSON.parse(rawText);
      } catch (e) {
        parsedData = rawText; // If XML or plain text
      }

      // Target paths where this file needs to reside locally
      const targetPaths = [
        path.join(__dirname, file),
        path.join(__dirname, 'public', file),
        path.join(__dirname, 'data_store', file),
        path.join(__dirname, 'dist', file),
        path.join(__dirname, 'dist', 'public', file)
      ];

      for (const targetPath of targetPaths) {
        try {
          const dir = path.dirname(targetPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          const contentToWrite = typeof parsedData === 'string' ? parsedData : JSON.stringify(parsedData, null, 2);
          fs.writeFileSync(targetPath, contentToWrite, 'utf8');
        } catch (e) {}
      }
      syncedCount++;
      console.log(`Synced data file: ${file}`);
    } catch (err) {
      console.error(`Error syncing data file ${file}:`, err);
    }
  }
  return syncedCount;
}

async function fetchRepoTreeRecursive(dirPath = '') {
  const url = `https://api.github.com/repos/${USERNAME}/${REPO}/contents/${dirPath}?ref=${BRANCH}`;
  let items = [];
  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'CSN-Repo-Syncer'
      }
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data)) {
      items = data;
    }
  } catch (e) {
    console.error(`Error fetching tree for ${dirPath}:`, e);
  }
  return items;
}

async function syncAllAssetsAndPhotos() {
  console.log('--- Starting Photos, Media & Asset Folders Sync from GitHub ---');
  const mediaFolders = [
    'assets/uploads',
    'public/assets/uploads',
    'public/uploads',
    'public',
    'assets'
  ];

  const fileMap = new Map(); // path -> rawUrl

  for (const folder of mediaFolders) {
    const items = await fetchRepoTreeRecursive(folder);
    for (const item of items) {
      if (item.type === 'file') {
        const name = item.name;
        const ext = path.extname(name).toLowerCase();
        const mediaExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.ico', '.pdf', '.doc', '.docx', '.xlsx', '.zip', '.xml', '.json'];
        if (mediaExts.includes(ext)) {
          fileMap.set(item.path, item.download_url || `https://raw.githubusercontent.com/${USERNAME}/${REPO}/${BRANCH}/${item.path}`);
        }
      }
    }
  }

  console.log(`Found ${fileMap.size} total asset/photo files to sync from repo.`);

  let photoSyncCount = 0;
  for (const [filePath, downloadUrl] of fileMap.entries()) {
    try {
      const res = await fetch(downloadUrl);
      if (!res.ok) continue;

      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = path.basename(filePath);

      // Write to corresponding local directories
      const targetDirs = [
        path.join(__dirname, 'public', 'uploads'),
        path.join(__dirname, 'public', 'assets', 'uploads'),
        path.join(__dirname, 'assets', 'uploads'),
        path.join(__dirname, 'data_store', 'uploads'),
        path.join(__dirname, 'dist', 'public', 'uploads'),
        path.join(__dirname, 'dist', 'public', 'assets', 'uploads')
      ];

      for (const dir of targetDirs) {
        try {
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          fs.writeFileSync(path.join(dir, fileName), buffer);
        } catch (e) {}
      }

      // Also if file is in public root, copy to root public folder
      if (filePath.startsWith('public/') && !filePath.includes('uploads')) {
        const rootPublicPath = path.join(__dirname, filePath);
        try {
          const dir = path.dirname(rootPublicPath);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(rootPublicPath, buffer);
        } catch (e) {}
      }

      photoSyncCount++;
      console.log(`Synced asset photo/file: ${fileName}`);
    } catch (err) {
      console.error(`Failed syncing asset ${filePath}:`, err);
    }
  }

  return photoSyncCount;
}

async function run() {
  const dataCount = await syncJsonAndDataFiles();
  const mediaCount = await syncAllAssetsAndPhotos();
  console.log(`--- GitHub Entire Repo Sync Completed Successfully! (${dataCount} data files, ${mediaCount} photos & media assets) ---`);
}

run();

