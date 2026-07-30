const fs = require('fs');
let code = fs.readFileSync('src/components/AdminLoginModal.tsx', 'utf8');

code = code.replace(/  isSuperAdmin: boolean;\n  setIsSuperAdmin: \(status: boolean\) => void;\n/, '');
code = code.replace(/  isSuperAdmin,\n  setIsSuperAdmin,\n/, '');

fs.writeFileSync('src/components/AdminLoginModal.tsx', code);
