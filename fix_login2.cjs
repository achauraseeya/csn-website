const fs = require('fs');
let code = fs.readFileSync('src/components/AdminLoginModal.tsx', 'utf8');

code = code.replace(
/              \{isSuperAdmin && onOpenDashboard && \(/,
`              {isAdmin && onOpenDashboard && (`
);

// Remove the whole Super Admin Control Subpanel
code = code.replace(/              \/\* Super Admin Control Subpanel \*\/[\s\S]*?              \<\/div\>\n/g, '');

fs.writeFileSync('src/components/AdminLoginModal.tsx', code);
