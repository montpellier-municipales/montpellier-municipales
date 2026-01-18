import { config } from "~/speak-config";
import Home, { useLists, useHomeContent, useLatestPosts, head } from "../index";
import type { StaticGenerateHandler } from "@builder.io/qwik-city";

export { useLists, useHomeContent, useLatestPosts, head };
export default Home;

export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: config.supportedLocales
      .filter((locale) => locale.lang !== config.defaultLocale.lang)
      .map((locale) => ({ lang: locale.lang })),
  };
};
