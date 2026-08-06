const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  'const fetchAllGithubData = () => {',
  'const fetchAllGithubData = () => {\n      const fetches = [];'
);

code = code.replace(
  /apiFetch</g,
  'fetches.push(apiFetch<'
);

// We need to carefully replace the ending `.catch(() => {});` of each apiFetch with `.catch(() => {}))` to close the push.
// But only inside fetchAllGithubData function...
