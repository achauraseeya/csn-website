const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importTarget = "import { getGithubSettings, getPat } from './utils/githubDb';";
const importReplacement = `import { getGithubSettings, getPat } from './utils/githubDb';\nimport { fetchDriveFolderImagesClient } from './utils/driveClient';`;
code = code.replace(importTarget, importReplacement);

// 1. Patch the background fetch:
const bgFetchTarget = `fetch(\`/api/drive-folder-images?folderId=\${folderId}\`, { signal: controller.signal })
        .then(res => res.json())`;
const bgFetchReplacement = `fetchDriveFolderImagesClient(folderId)
        .then(data => { return data; })`;
code = code.replace(bgFetchTarget, bgFetchReplacement);

// 2. Patch the eager fetch in handleAddAlbum:
const eagerFetchTarget = `const res = await fetch(\`/api/drive-folder-images?folderId=\${driveId}\`);
           const data = await res.json();`;
const eagerFetchReplacement = `const data = await fetchDriveFolderImagesClient(driveId);`;
code = code.replace(eagerFetchTarget, eagerFetchReplacement);

fs.writeFileSync('src/App.tsx', code);
