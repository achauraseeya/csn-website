const fs = require('fs');
const glob = require('glob'); // Not installed, I will use fs.readdirSync recursively
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace color classes
    // emerald -> indigo
    // green -> blue
    content = content.replace(/emerald-/g, 'indigo-');
    content = content.replace(/green-/g, 'blue-');
    
    // Some specific ones
    content = content.replace(/bg-emerald/g, 'bg-indigo');
    content = content.replace(/text-emerald/g, 'text-indigo');
    content = content.replace(/border-emerald/g, 'border-indigo');
    
    content = content.replace(/bg-green/g, 'bg-blue');
    content = content.replace(/text-green/g, 'text-blue');
    content = content.replace(/border-green/g, 'border-blue');

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    }
  }
});
