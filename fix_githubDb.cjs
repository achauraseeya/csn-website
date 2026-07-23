const fs = require('fs');
let code = fs.readFileSync('src/utils/githubDb.ts', 'utf8');

const newFunc = `
export async function uploadImageToGithub(fileName: string, base64Data: string, commitMessage: string): Promise<string> {
  const settings = getGithubSettings();
  const pat = getPat();
  if (!settings.enabled || !pat) throw new Error("GitHub sync is disabled or PAT is missing");
  
  // Extract pure base64 without data URL prefix (e.g., "data:image/jpeg;base64,...")
  const base64Content = base64Data.split(',')[1] || base64Data;
  
  const path = \`assets/uploads/\${fileName}\`;
  const url = \`https://api.github.com/repos/\${settings.username}/\${settings.repo}/contents/\${path}\`;
  const sha = await fetchFileSha(path, settings, pat);

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': \`token \${pat}\`,
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
    throw new Error(\`Failed to upload \${path} to GitHub: \${res.statusText}\`);
  }

  // Use raw.githubusercontent for immediate viewing
  return \`https://raw.githubusercontent.com/\${settings.username}/\${settings.repo}/\${settings.branch}/\${path}\`;
}
`;

code = code.replace("export async function saveFileToGithub", newFunc + "\nexport async function saveFileToGithub");

fs.writeFileSync('src/utils/githubDb.ts', code);
