import fs from 'node:fs';
import path from 'node:path';

const dirsToScan = [
  path.resolve('src/routes'),
  path.resolve('src/routes/[lang]'),
  path.resolve('src/routes/info'),
  path.resolve('src/routes/[lang]/info')
];

dirsToScan.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (file.endsWith('.md.ts')) {
      const sourcePath = path.join(dir, file);
      // contact.md.ts -> contact.md
      const dirName = file.replace('.ts', ''); 
      const targetDir = path.join(dir, dirName);
      
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
      }
      
      const targetPath = path.join(targetDir, 'index.ts');
      
      const content = fs.readFileSync(sourcePath, 'utf-8');
      fs.writeFileSync(targetPath, content);
      fs.unlinkSync(sourcePath);
      console.log(`Migrated ${sourcePath} -> ${targetPath}`);
    }
  });
});
