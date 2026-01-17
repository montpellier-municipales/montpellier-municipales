import fs from 'node:fs';
import path from 'node:path';

const pages = [
  'contact',
  'inscription',
  'mentions-legales',
  'politique-confidentialite',
  'qui-sommes-nous',
  'role-mairie-metropole'
];

const rootDir = path.resolve('src/routes');
const langDir = path.resolve('src/routes/[lang]');

pages.forEach(page => {
  // Root file
  const rootContent = `import { serveStaticMarkdown } from "~/utils/markdown-server";
export const onGet = serveStaticMarkdown("${page}");
`;
  fs.writeFileSync(path.join(rootDir, `${page}.md.ts`), rootContent);

  // Lang file
  const langContent = `import { serveStaticMarkdown } from "~/utils/markdown-server";
import { config } from "~/speak-config";
import { type StaticGenerateHandler } from "@builder.io/qwik-city";

export const onGet = serveStaticMarkdown("${page}");

export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: config.supportedLocales
      .filter((locale) => locale.lang !== config.defaultLocale.lang)
      .map((locale) => ({ lang: locale.lang })),
  };
};
`;
  fs.writeFileSync(path.join(langDir, `${page}.md.ts`), langContent);
});

console.log('Static markdown routes generated.');
