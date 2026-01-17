import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');
const ORIGIN = 'https://montpellier-municipales.fr';
const DEFAULT_LANG = 'fr';
const LANGUAGES = ['ar', 'en', 'es', 'fr', 'oc'];
const NON_DEFAULT_LANGS = LANGUAGES.filter(l => l !== DEFAULT_LANG);

// Helper to convert directory-based markdown routes to actual files
// e.g. dist/contact.md/index.html -> dist/contact.md
function fixMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file.endsWith('.md')) {
        const indexHtml = path.join(filePath, 'index.html');
        if (fs.existsSync(indexHtml)) {
           const content = fs.readFileSync(indexHtml);
           // Remove directory and replace with file
           fs.rmSync(filePath, { recursive: true, force: true });
           fs.writeFileSync(filePath, content);
           console.log(`Converted to file: ${filePath}`);
        } else {
           // Recurse just in case
           fixMarkdownFiles(filePath);
        }
      } else {
        fixMarkdownFiles(filePath);
      }
    }
  });
}

console.log('Fixing markdown file structures...');
fixMarkdownFiles(DIST_DIR);

// Helper to find all index.html AND .md files
function getContentFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getContentFiles(filePath, fileList);
    } else {
      if (file === 'index.html' || file.endsWith('.md')) {
        fileList.push(filePath);
      }
    }
  });
  return fileList;
}

console.log('Generating sitemap...');

const files = getContentFiles(DIST_DIR);
const urlMap = new Map(); // canonical_path -> Set(langs)

files.forEach(file => {
  const relPath = path.relative(DIST_DIR, file);
  // relPath examples: 
  // 'index.html'
  // 'contact.md'
  // 'en/index.html'
  // 'en/contact.md'
  
  const parts = relPath.split(path.sep);
  const fileName = parts[parts.length - 1];
  
  if (fileName === 'index.html') {
    parts.pop(); // Remove index.html
  } else {
    // It's likely a .md file, keep it in the path
    // But we need to handle the lang prefix logic below
  }
  
  let lang = DEFAULT_LANG;
  let canonicalParts = [...parts];

  if (parts.length > 0 && NON_DEFAULT_LANGS.includes(parts[0])) {
    lang = parts[0];
    canonicalParts = parts.slice(1);
  }

  const canonicalPath = canonicalParts.join('/');
  
  if (!urlMap.has(canonicalPath)) {
    urlMap.set(canonicalPath, new Set());
  }
  urlMap.get(canonicalPath).add(lang);
});

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

// Sort keys for deterministic output
const sortedPaths = Array.from(urlMap.keys()).sort();

sortedPaths.forEach(pathKey => {
  const langs = urlMap.get(pathKey);
  
  // Construct URLs for all available languages for this path
  const variants = [];
  langs.forEach(l => {
    let urlPath = '';
    // If pathKey ends with .md, do not add trailing slash
    const isFile = pathKey.endsWith('.md');
    
    if (l === DEFAULT_LANG) {
      urlPath = pathKey;
    } else {
      urlPath = pathKey ? `${l}/${pathKey}` : `${l}`;
    }
    
    // Add trailing slash if it's not a file and not empty
    if (urlPath && !isFile && !urlPath.endsWith('/')) {
        urlPath += '/';
    } else if (!urlPath) {
        // Root
        urlPath = '';
    }

    const loc = `${ORIGIN}/${urlPath}`;
    variants.push({ lang: l, loc });
  });

  // Determine x-default
  const defaultVariant = variants.find(v => v.lang === DEFAULT_LANG);
  const xDefaultLoc = defaultVariant ? defaultVariant.loc : variants[0].loc;

  // Add entries
  variants.forEach(variant => {
    sitemap += `  <url>
    <loc>${variant.loc}</loc>
`;
    // Add alternates
    variants.forEach(alt => {
      sitemap += `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.loc}"/>
`;
    });
    // Add x-default
    sitemap += `    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefaultLoc}"/>
  </url>
`;
  });
});

sitemap += `</urlset>`;

fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemap);
console.log(`Sitemap generated at dist/sitemap.xml with ${sortedPaths.length} pages.`);