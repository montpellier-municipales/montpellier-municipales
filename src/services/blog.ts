import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { BlogPost } from "~/types/schema";

const BLOG_DIR = join(process.cwd(), "src/content/blog");

/**
 * Lit un fichier Markdown et retourne ses métadonnées + contenu
 */
async function parseFile(
  filePath: string,
  filenameId: string,
  lang: string
): Promise<BlogPost | null> {
  try {
    const fileContent = await readFile(filePath, "utf-8");
    const { data, content: markdownContent } = matter(fileContent);
    const htmlContent = await marked.parse(markdownContent);
    const excerptHtml = data.excerpt ? await marked.parse(data.excerpt) : undefined;

    const publicSlug = data.slug || filenameId;

    return {
      id: filenameId, // On garde l'ID technique (nom du dossier)
      slug: publicSlug,
      lang,
      title: data.title,
      tags: data.tags,
      date: data.date,
      author: data.author,
      excerpt: data.excerpt,
      excerptHtml: excerptHtml as string | undefined,
      content: htmlContent as string,
    };
  } catch {
    return null;
  }
}

export const getBlogPosts = async (lang: string): Promise<BlogPost[]> => {
  try {
    const entries = await readdir(BLOG_DIR);

    const postsPromises = entries.map(async (entryName) => {
      const entryPath = join(BLOG_DIR, entryName);
      const entryStat = await stat(entryPath);

      if (entryStat.isDirectory()) {
        const filePath = join(entryPath, `${lang}.md`);
        return await parseFile(filePath, entryName, lang);
      } else if (entryName.endsWith(`.${lang}.md`)) {
        const id = entryName.replace(`.${lang}.md`, "");
        return await parseFile(entryPath, id, lang);
      }
      return null;
    });

    const posts = await Promise.all(postsPromises);

    return posts
      .filter((post): post is BlogPost => post !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Error reading blog directory:", error);
    return [];
  }
};

export const getBlogPostsByTag = async (
  lang: string,
  tag: string
): Promise<BlogPost[]> => {
  const allPosts = await getBlogPosts(lang);
  return allPosts.filter((post) => post.tags?.includes(tag));
};

export const getBlogPost = async (
  slug: string,
  lang: string
): Promise<BlogPost | null> => {
  const allPosts = await getBlogPosts(lang);
  const post = allPosts.find((p) => p.slug === slug);
  return post || null;
};

/**
 * Récupère les slugs alternatifs pour un article donné (basé sur son ID)
 * Retourne un objet: { fr: 'slug-fr', en: 'slug-en' }
 */
export const getPostAlternates = async (
  id: string
): Promise<Record<string, string>> => {
  const alternates: Record<string, string> = {};

  // On regarde dans le dossier correspondant à l'ID
  const folderPath = join(BLOG_DIR, id);

  try {
    const statDir = await stat(folderPath);
    if (statDir.isDirectory()) {
      const files = await readdir(folderPath);

      for (const file of files) {
        if (file.endsWith(".md")) {
          const lang = file.replace(".md", "");
          const post = await parseFile(join(folderPath, file), id, lang);
          if (post) {
            alternates[lang] = post.slug;
          }
        }
      }
    }
  } catch {
    // Si ce n'est pas un dossier, on pourrait gérer le cas fichiers plats,
    // mais pour l'instant on se concentre sur la structure dossier recommandée.
  }

  return alternates;
};
