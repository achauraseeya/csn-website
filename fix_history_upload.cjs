const fs = require('fs');
let code = fs.readFileSync('src/components/HistorySection.tsx', 'utf8');

code = code.replace(
  "import { Album, Language, Notice, SiteTexts, NetworkBranch } from '../types';",
  "import { Album, Language, Notice, SiteTexts, NetworkBranch, Member } from '../types';\nimport { uploadImageToGithub } from '../utils/githubDb';"
);

const newUpload = `
  const handleFileUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const fileName = \`\${Date.now()}_\${file.name.replace(/[^a-z0-9.]/gi, '_')}\`;
          const url = await uploadImageToGithub(fileName, base64, \`Upload image \${file.name}\`);
          resolve(url);
        } catch (e: any) {
          reject(e);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };
`;

code = code.replace(/const handleFileUpload = async \(file: File\): Promise<string> => \{[\s\S]*?reader\.readAsDataURL\(file\);\n    \}\);\n  \};/, newUpload.trim());

fs.writeFileSync('src/components/HistorySection.tsx', code);
