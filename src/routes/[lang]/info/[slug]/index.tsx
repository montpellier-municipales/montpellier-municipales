import { StaticGenerateHandler } from "@builder.io/qwik-city";
import BlogPost, { useBlogPost, head } from "../../../info/[slug]/index";
import { getBlogPosts } from "~/services/blog";
import { config } from "~/speak-config";

export { useBlogPost, head };
export default BlogPost;

export const onStaticGenerate: StaticGenerateHandler = async () => {
  const targetLangs = config.supportedLocales.filter(
    (locale) => locale.lang !== config.defaultLocale.lang
  );

  const params: { lang: string; slug: string }[] = [];

  for (const loc of targetLangs) {
    const posts = await getBlogPosts(loc.lang);
    for (const post of posts) {
      params.push({
        lang: loc.lang,
        slug: post.slug,
      });
    }
  }

  return {
    params,
  };
};
