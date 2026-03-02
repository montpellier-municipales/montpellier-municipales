import { config } from "~/speak-config";
import ChartersPage, {
  useChartersData,
  head,
} from "../../../comparateur/chartes/index";
import type { StaticGenerateHandler } from "@builder.io/qwik-city";

export { useChartersData, head };
export default ChartersPage;

export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: config.supportedLocales
      .filter((locale) => locale.lang !== config.defaultLocale.lang)
      .map((locale) => ({ lang: locale.lang })),
  };
};
