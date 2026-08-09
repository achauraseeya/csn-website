const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Update grid layouts from lg to xl to prevent squeezing
      content = content.replace(/lg:grid-cols-12/g, 'xl:grid-cols-12');
      content = content.replace(/lg:col-span-3/g, 'xl:col-span-3');
      content = content.replace(/lg:col-span-9/g, 'xl:col-span-9');
      content = content.replace(/lg:col-span-4/g, 'xl:col-span-4');
      content = content.replace(/lg:col-span-8/g, 'xl:col-span-8');
      content = content.replace(/lg:col-span-7/g, 'xl:col-span-7');
      content = content.replace(/lg:col-span-5/g, 'xl:col-span-5');
      
      // Update display toggles
      content = content.replace(/hidden lg:block/g, 'hidden xl:block');
      content = content.replace(/hidden lg:flex/g, 'hidden xl:flex');
      content = content.replace(/lg:hidden/g, 'xl:hidden');
      
      // Update sticky positioning
      content = content.replace(/lg:sticky/g, 'xl:sticky');
      content = content.replace(/lg:top-/g, 'xl:top-');

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir('src');
console.log('done');
