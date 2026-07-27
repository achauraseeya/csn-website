const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importStatement = "import { fetchDriveFolderImagesClient } from './utils/driveClient';\n";
if (!code.includes("fetchDriveFolderImagesClient }")) {
  code = importStatement + code;
  fs.writeFileSync('src/App.tsx', code);
}
