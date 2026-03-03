import { serveThemeMarkdown } from "~/utils/markdown-server";
import type { StaticGenerateHandler } from "@builder.io/qwik-city";
import { THEMES } from "~/services/thematiques";

export const onGet = serveThemeMarkdown;

export const onStaticGenerate: StaticGenerateHandler = async () => ({
  params: Object.values(THEMES).map((t) => ({ theme: t.urlSlug })),
});
