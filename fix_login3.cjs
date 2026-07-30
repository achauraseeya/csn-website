const fs = require('fs');
let code = fs.readFileSync('src/components/AdminLoginModal.tsx', 'utf8');

code = code.replace(/    setIsSuperAdmin\(false\);\n/g, '');
code = code.replace(/    localStorage\.removeItem\('chaurasiya_is_super_admin'\);\n/g, '');

fs.writeFileSync('src/components/AdminLoginModal.tsx', code);
