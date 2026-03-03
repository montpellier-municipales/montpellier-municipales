import { config } from "~/speak-config";
import ThemePage, {
  useThemeData,
  head,
} from "~/routes/thematiques/[theme]/index";
import type { StaticGenerateHandler } from "@builder.io/qwik-city";
import { THEMES } from "~/services/thematiques";

export { useThemeData, head };
export default ThemePage;

export const onStaticGenerate: StaticGenerateHandler = async () => ({
  params: config.supportedLocales
    .filter((l) => l.lang !== config.defaultLocale.lang)
    .flatMap((l) =>
      Object.values(THEMES).map((t) => ({ lang: l.lang, theme: t.urlSlug })),
    ),
});
