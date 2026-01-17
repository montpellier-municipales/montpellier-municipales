import { serveBlogMarkdown } from "~/utils/markdown-server";
import { type StaticGenerateHandler } from "@builder.io/qwik-city";
import { getBlogPosts } from "~/services/blog";
import { config } from "~/speak-config";

export const onGet = serveBlogMarkdown;

export const onStaticGenerate: StaticGenerateHandler = async () => {
  const posts = await getBlogPosts(config.defaultLocale.lang);
  return {
    params: posts.map((post) => ({ slug: post.slug })),
  };
};