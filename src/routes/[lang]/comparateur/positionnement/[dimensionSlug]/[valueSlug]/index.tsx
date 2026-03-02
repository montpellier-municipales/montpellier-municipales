import { config } from "~/speak-config";
import ValuePage, {
  useValuePageData,
  head,
} from "../../../../../comparateur/positionnement/[dimensionSlug]/[valueSlug]/index";
import type { StaticGenerateHandler } from "@builder.io/qwik-city";
import { VALUE_SLUGS, DIMENSION_SLUGS } from "~/services/positioning";

export { useValuePageData, head };
export default ValuePage;

export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: config.supportedLocales
      .filter((locale) => locale.lang !== config.defaultLocale.lang)
      .flatMap((locale) =>
        Object.entries(VALUE_SLUGS).flatMap(([dimension, values]) =>
          Object.entries(values).map(([, valueSlug]) => ({
            lang: locale.lang,
            dimensionSlug: DIMENSION_SLUGS[dimension],
            valueSlug,
          })),
        ),
      ),
  };
};
