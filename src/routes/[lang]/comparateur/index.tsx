import { config } from "~/speak-config";
import ComparatorPage, {
  useComparatorData,
  head,
} from "../../comparateur/index";
import type { StaticGenerateHandler } from "@builder.io/qwik-city";

export { useComparatorData, head };
export default ComparatorPage;

export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: config.supportedLocales
      .filter((locale) => locale.lang !== config.defaultLocale.lang)
      .map((locale) => ({ lang: locale.lang })),
  };
};
