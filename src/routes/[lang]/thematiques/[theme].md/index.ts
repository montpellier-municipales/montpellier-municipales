import { serveThemeMarkdown } from "~/utils/markdown-server";
import type { StaticGenerateHandler } from "@builder.io/qwik-city";
import { THEMES } from "~/services/thematiques";
import { config } from "~/speak-config";

export const onGet = serveThemeMarkdown;

export const onStaticGenerate: StaticGenerateHandler = async () => ({
  params: config.supportedLocales
    .filter((l) => l.lang !== config.defaultLocale.lang)
    .flatMap((l) =>
      Object.values(THEMES).map((t) => ({ lang: l.lang, theme: t.urlSlug })),
    ),
});
