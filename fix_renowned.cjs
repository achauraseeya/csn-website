const fs = require('fs');
let code = fs.readFileSync('src/components/RenownedPeople.tsx', 'utf8');

// Remove import
code = code.replace(/import \{ apiFetch, saveFileToGithub, isSuperAdminUser \} from '\.\.\/utils\/githubDb';/, "import { apiFetch, saveFileToGithub } from '../utils/githubDb';");

// Replace saving block 1
code = code.replace(/      const isSuper = isSuperAdminUser\(\);\n      await saveFileToGithub\('renowned_people.json', nextPeople, editingPerson \? `Update renowned person: \$\{nameEn\}` : `Add renowned person: \$\{nameEn\}`\);\n      \n      if \(isSuper\) \{\n        setPeople\(nextPeople\);\n      \}/,
`      await saveFileToGithub('renowned_people.json', nextPeople, editingPerson ? \`Update renowned person: \${nameEn}\` : \`Add renowned person: \${nameEn}\`);
      setPeople(nextPeople);`
);

// Replace saving block 2
code = code.replace(/      const isSuper = isSuperAdminUser\(\);\n      await saveFileToGithub\('renowned_people.json', nextPeople, `Delete renowned person: \$\{name\}`\);\n      if \(isSuper\) \{\n        setPeople\(nextPeople\);\n      \}/,
`      await saveFileToGithub('renowned_people.json', nextPeople, \`Delete renowned person: \${name}\`);
      setPeople(nextPeople);`
);

fs.writeFileSync('src/components/RenownedPeople.tsx', code);
