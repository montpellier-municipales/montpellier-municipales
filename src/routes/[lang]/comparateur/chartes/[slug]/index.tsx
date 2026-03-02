import { config } from "~/speak-config";
import CharterDetailPage, {
  useCharterData,
  head,
} from "../../../../comparateur/chartes/[slug]/index";
import { getAllCharters } from "~/services/charters";
import type { StaticGenerateHandler } from "@builder.io/qwik-city";

export { useCharterData, head };
export default CharterDetailPage;

export const onStaticGenerate: StaticGenerateHandler = async () => {
  const charters = getAllCharters();
  return {
    params: config.supportedLocales
      .filter((locale) => locale.lang !== config.defaultLocale.lang)
      .flatMap((locale) =>
        charters.map((c) => ({ lang: locale.lang, slug: c.slug })),
      ),
  };
};
