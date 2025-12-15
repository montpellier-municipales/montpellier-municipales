import { config } from "~/speak-config";
import Home, { useLists, head } from "../index";
import type { StaticGenerateHandler } from "@builder.io/qwik-city";

export { useLists, head };
export default Home;

export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: config.supportedLocales
      .filter((locale) => locale.lang !== config.defaultLocale.lang)
      .map((locale) => ({ lang: locale.lang })),
  };
};
