import { StaticGenerateHandler } from "@builder.io/qwik-city";
import BlogList, { useBlogPosts } from "../../info/index";
import { config } from "~/speak-config";

export { useBlogPosts };
export default BlogList;

// SSG : Génération statique pour la liste des actualités par langue
export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: config.supportedLocales
      .filter((locale) => locale.lang !== config.defaultLocale.lang)
      .map((locale) => ({ lang: locale.lang })),
  };
};
