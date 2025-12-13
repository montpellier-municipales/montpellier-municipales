import { StaticGenerateHandler } from "@builder.io/qwik-city";
import BlogPost, { useBlogPost, head } from "../../../info/[slug]/index";
import { defaultLocale, locales } from "compiled-i18n";
import { getBlogPosts } from "~/services/blog";

export { useBlogPost, head };
export default BlogPost;

export const onStaticGenerate: StaticGenerateHandler = async () => {
  const targetLangs = locales.filter((l) => l !== defaultLocale);

  const params: { lang: string; slug: string }[] = [];

  for (const loc of targetLangs) {
    const posts = await getBlogPosts(loc);
    for (const post of posts) {
      params.push({
        lang: loc,
        slug: post.slug,
      });
    }
  }

  return {
    params,
  };
};
