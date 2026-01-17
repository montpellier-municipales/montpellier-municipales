import { serveHomeMarkdown } from "~/utils/markdown-server";
import { config } from "~/speak-config";
import { type StaticGenerateHandler } from "@builder.io/qwik-city";

export const onGet = serveHomeMarkdown;

export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: config.supportedLocales
      .filter((locale) => locale.lang !== config.defaultLocale.lang)
      .map((locale) => ({ lang: locale.lang })),
  };
};