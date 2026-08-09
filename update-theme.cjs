const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');
if (!css.includes('--breakpoint-lg: 850px;')) {
  css = css.replace('@theme {', '@theme {\n  --breakpoint-lg: 850px;\n  --breakpoint-md: 700px;');
  fs.writeFileSync('src/index.css', css);
}
