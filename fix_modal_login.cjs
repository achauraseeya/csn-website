const fs = require('fs');
let code = fs.readFileSync('src/components/AdminLoginModal.tsx', 'utf8');

code = code.replace(
/              \}\)\n              \<\/div\>/,
`              )}`
);

fs.writeFileSync('src/components/AdminLoginModal.tsx', code);
