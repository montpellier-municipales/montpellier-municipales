import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');
const ORIGIN = 'https://montpellier-municipales.fr';
const DEFAULT_LANG = 'fr';
const LANGUAGES = ['ar', 'en', 'es', 'fr', 'oc'];
const NON_DEFAULT_LANGS = LANGUAGES.filter(l => l !== DEFAULT_LANG);

// Helper to find all index.html files
function getHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else {
      if (file === 'index.html') {
        fileList.push(filePath);
      }
    }
  });
  return fileList;
}

console.log('Generating sitemap...');

const files = getHtmlFiles(DIST_DIR);
const urlMap = new Map(); // canonical_path -> Set(langs)

files.forEach(file => {
  const relPath = path.relative(DIST_DIR, file);
  // relPath examples: 'index.html', 'en/index.html', 'listes/index.html', 'en/listes/index.html'
  
  const parts = relPath.split(path.sep);
  // Remove 'index.html'
  parts.pop(); 
  
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
    if (l === DEFAULT_LANG) {
      urlPath = pathKey ? `${pathKey}/` : '';
    } else {
      urlPath = pathKey ? `${l}/${pathKey}/` : `${l}/`;
    }
    const loc = `${ORIGIN}/${urlPath}`;
    variants.push({ lang: l, loc });
  });

  // Determine x-default (use DEFAULT_LANG version if exists, else first available?)
  // Ideally x-default points to the version that auto-redirects. 
  // In our case, the root (fr) does auto-redirect logic. 
  // So if 'fr' exists, use it as x-default.
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
