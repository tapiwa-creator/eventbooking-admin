const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/preci/Desktop/event-admin/admin/src';

const replacements = [
  { regex: /#6C5CE7/gi, replacement: '#059669' },
  { regex: /#5b21b6/gi, replacement: '#064e3b' },
  { regex: /#6d28d9/gi, replacement: '#047857' },
  { regex: /#ede9fe/gi, replacement: '#d1fae5' },
  { regex: /#4a2fb5/gi, replacement: '#065f46' },
  { regex: /#2d1b8e/gi, replacement: '#064e3b' },
  { regex: /#EEEDF5/gi, replacement: '#ecfdf5' },
  { regex: /#A89FD4/gi, replacement: '#6ee7b7' },
  { regex: /purple/g, replacement: 'emerald' },
  { regex: /Purple/g, replacement: 'Emerald' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content;
      
      // Apply color replacements
      for (const r of replacements) {
        newContent = newContent.replace(r.regex, r.replacement);
      }
      
      // Keep FONT variable but change it to Inter, just in case
      newContent = newContent.replace(/const FONT = [^;]+;/g, "const FONT = \"'Inter', sans-serif\";");
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Updated', fullPath);
      }
    }
  }
}

processDir(srcDir);
