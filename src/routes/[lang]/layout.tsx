import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { config } from "~/speak-config";

export const onRequest: RequestHandler = async ({ params, locale }) => {
  const lang = config.supportedLocales.find(
    (locale) => locale.lang === params.lang
  );
  if (lang) {
    locale(lang.lang);
  } else {
    locale(config.defaultLocale.lang);
  }
};

export default component$(() => {
  return <Slot />;
});
