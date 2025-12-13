import { StaticGenerateHandler } from "@builder.io/qwik-city";
import BlogList, { useBlogPosts } from "../../info/index";
import { locales, defaultLocale } from "compiled-i18n"; // Utilisation de compiled-i18n

export { useBlogPosts };
export default BlogList;

// SSG : Génération statique pour la liste des actualités par langue
export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: locales
      .filter((l) => l !== defaultLocale)
      .map((l) => ({ lang: l })),
  };
};
