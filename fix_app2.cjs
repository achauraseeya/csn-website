const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/  const \[isSuperAdmin, setIsSuperAdmin\] = useState<boolean>\(\(\) => \{\n    return localStorage\.getItem\('chaurasiya_is_super_admin'\) === 'true';\n  \}\);\n/g, '');
code = code.replace(/        isSuperAdmin=\{isSuperAdmin\}\n        setIsSuperAdmin=\{setIsSuperAdmin\}\n/g, '');

fs.writeFileSync('src/App.tsx', code);
