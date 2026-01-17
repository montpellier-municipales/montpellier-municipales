import { type RequestHandler } from "@builder.io/qwik-city";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { config } from "~/speak-config";
import { getBlogPost } from "~/services/blog";
import matter from "gray-matter";

export const serveStaticMarkdown = (pageDir: string): RequestHandler => {
  return async (ev) => {
    try {
      const lang = ev.params.lang || config.defaultLocale.lang;
      const filePath = join(
        process.cwd(),
        "src/content",
        pageDir,
        `${lang}.md`
      );
      const content = await readFile(filePath, "utf-8");

      ev.headers.set("Content-Type", "text/markdown; charset=utf-8");
      ev.text(200, content);
    } catch {
      ev.text(404, "Markdown not found");
    }
  };
};

export const serveBlogMarkdown: RequestHandler = async (ev) => {
  try {
    const lang = ev.params.lang || config.defaultLocale.lang;
    const slug = ev.params.slug;

    const post = await getBlogPost(slug, lang);

    if (!post) {
      ev.text(404, "Post not found");
      return;
    }

    const filePath = join(
      process.cwd(),
      "src/content/blog",
      post.id,
      `${lang}.md`
    );
    const content = await readFile(filePath, "utf-8");

    const { data, content: markdownContent } = matter(content);

    ev.headers.set("Content-Type", "text/markdown; charset=utf-8");
    ev.text(200, `# ${data.title}\n\n${markdownContent}`);
  } catch {
    ev.text(404, "Markdown source not found");
  }
};
