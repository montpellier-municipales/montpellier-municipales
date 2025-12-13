import { type RequestHandler } from "@builder.io/qwik-city";
import { getAllLists } from "~/services/lists";
import { getBlogPosts } from "~/services/blog";
import { locales, defaultLocale } from "compiled-i18n"; // Imports de compiled-i18n

export const onGet: RequestHandler = async ({ request, send }) => {
  // Récupérer l'origine de la requête (ex: https://montpellier2026.fr ou http://localhost:5173)
  // En production derrière un proxy, il faut peut-être forcer une URL
  const url = new URL(request.url);
  const siteUrl = url.origin;

  const urls: string[] = [];

  // Fonctions helper
  const getPrefix = (lang: string) =>
    lang === defaultLocale ? "" : `/${lang}`;

  // 1. Pages statiques
  for (const loc of locales) { // Utilisation de locales de compiled-i18n
    const prefix = getPrefix(loc);
    urls.push(`${siteUrl}${prefix}/`);
    urls.push(`${siteUrl}${prefix}/comparateur`);
    urls.push(`${siteUrl}${prefix}/info`);
  }

  // 2. Listes Candidates
  // On suppose que l'ID est le même pour toutes les langues (ce qui est le cas dans notre design)
  const lists = await getAllLists();
  for (const list of lists) {
    for (const loc of locales) { // Utilisation de locales de compiled-i18n
      const prefix = getPrefix(loc);
      urls.push(`${siteUrl}${prefix}/listes/${list.id}`);
    }
  }

  // 3. Blog Posts
  // On doit récupérer les posts pour CHAQUE langue car les slugs diffèrent
  for (const loc of locales) { // Utilisation de locales de compiled-i18n
    const prefix = getPrefix(loc);
    const posts = await getBlogPosts(loc);

    for (const post of posts) {
      urls.push(`${siteUrl}${prefix}/info/${post.slug}`);
    }
  }

  // Génération XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  send(
    new Response(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
      },
    })
  );
};
