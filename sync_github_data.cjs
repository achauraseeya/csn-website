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
  'abhishek_profile.json'
];

async function syncJsonFiles() {
  console.log('--- Starting JSON Sync from GitHub ---');
  for (const file of JSON_FILES) {
    try {
      const url = `https://raw.githubusercontent.com/${USERNAME}/${REPO}/${BRANCH}/${file}?t=${Date.now()}`;
      console.log(`Fetching ${file} from ${url}...`);
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`Failed to fetch ${file} from GitHub (status: ${res.status}). Skipping.`);
        continue;
      }
      const data = await res.json();
      
      // Target paths where this json needs to reside
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
          fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf8');
          console.log(`Successfully wrote to ${targetPath}`);
        } catch (e) {
          // Ignore if directory doesn't exist yet (like dist)
        }
      }
    } catch (err) {
      console.error(`Error syncing JSON file ${file}:`, err);
    }
  }
}

async function fetchRepoDirFiles(dirPath) {
  const url = `https://api.github.com/repos/${USERNAME}/${REPO}/contents/${dirPath}?ref=${BRANCH}`;
  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!res.ok) return [];
    const items = await res.json();
    if (Array.isArray(items)) {
      return items.filter(i => i.type === 'file').map(i => i.name);
    }
  } catch (e) {
    console.error(`Error listing files in GitHub directory ${dirPath}:`, e);
  }
  return [];
}

async function syncImages() {
  console.log('--- Starting Image Sync from GitHub ---');
  const imageSources = [
    'assets/uploads',
    'public/assets/uploads',
    'public/uploads'
  ];

  const allImageNames = new Set();
  for (const src of imageSources) {
    const files = await fetchRepoDirFiles(src);
    files.forEach(f => {
      if (f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png') || f.endsWith('.webp') || f.endsWith('.gif')) {
        allImageNames.add(f);
      }
    });
  }

  console.log(`Found ${allImageNames.size} unique images to sync:`, Array.from(allImageNames));

  for (const imageName of allImageNames) {
    // Try to download from GitHub raw (try different paths if needed, usually assets/uploads is the source)
    let imageBuffer = null;
    const downloadCandidates = [
      `https://raw.githubusercontent.com/${USERNAME}/${REPO}/${BRANCH}/assets/uploads/${imageName}`,
      `https://raw.githubusercontent.com/${USERNAME}/${REPO}/${BRANCH}/public/assets/uploads/${imageName}`,
      `https://raw.githubusercontent.com/${USERNAME}/${REPO}/${BRANCH}/public/uploads/${imageName}`
    ];

    for (const url of downloadCandidates) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const arrayBuffer = await res.arrayBuffer();
          imageBuffer = Buffer.from(arrayBuffer);
          break; // Found it!
        }
      } catch (e) {}
    }

    if (!imageBuffer) {
      console.warn(`Could not download image: ${imageName}`);
      continue;
    }

    // Write to all local uploads directories
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
        const targetPath = path.join(dir, imageName);
        fs.writeFileSync(targetPath, imageBuffer);
        console.log(`Successfully wrote image ${imageName} to ${targetPath}`);
      } catch (e) {
        // Ignore if dist directories don't exist
      }
    }
  }
}

async function run() {
  await syncJsonFiles();
  await syncImages();
  console.log('--- GitHub Sync Completed ---');
}

run();
