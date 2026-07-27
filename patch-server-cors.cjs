const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

if (!code.includes("import cors")) {
  code = code.replace('import express from "express";', 'import express from "express";\nimport cors from "cors";');
  code = code.replace('const app = express();', 'const app = express();\n  app.use(cors());');
  fs.writeFileSync('server.ts', code);
}
