import { serveBlogMarkdown } from "~/utils/markdown-server";
import { type StaticGenerateHandler } from "@builder.io/qwik-city";
import { getBlogPosts } from "~/services/blog";
import { config } from "~/speak-config";

export const onGet = serveBlogMarkdown;

export const onStaticGenerate: StaticGenerateHandler = async () => {
  const params = [];
  for (const locale of config.supportedLocales) {
    if (locale.lang === config.defaultLocale.lang) continue;
    const posts = await getBlogPosts(locale.lang);
    for (const post of posts) {
      params.push({ lang: locale.lang, slug: post.slug });
    }
  }
  return { params };
};