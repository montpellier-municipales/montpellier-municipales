import type { SpeakConfig } from "qwik-speak";

export const config: SpeakConfig = {
  defaultLocale: { lang: "fr", currency: "EUR", timeZone: "Europe/Paris" },
  supportedLocales: [
    { lang: "ar", currency: "EUR", timeZone: "Europe/Paris", dir: "rtl" },
    { lang: "en", currency: "EUR", timeZone: "Europe/Paris", dir: "ltr" },
    { lang: "es", currency: "EUR", timeZone: "Europe/Paris", dir: "ltr" },
    { lang: "fr", currency: "EUR", timeZone: "Europe/Paris", dir: "ltr" },
    { lang: "oc", currency: "EUR", timeZone: "Europe/Paris", dir: "ltr" },
  ],
  assets: ["app"],
  runtimeAssets: ["home", "list", "comparator", "actu", "budget"],
};
