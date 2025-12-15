import { server$ } from "@builder.io/qwik-city";
import type { LoadTranslationFn, Translation, TranslationFn } from "qwik-speak";
//import { config } from "./speak-config";

const translationData = import.meta.glob<Translation>(
  "/src/i18n/**/*.json",
  { import: "default" }
);

/**
 * Using server$, translation data is always accessed on the server
 */
const loadTranslation$: LoadTranslationFn = server$(
  async (lang: string, asset: string) => {
    const res =
      await translationData[`/src/i18n/${lang}/${asset}.json`]?.();
    return res;
  }
);

export const translationFn: TranslationFn = {
  loadTranslation$: loadTranslation$,
};

// Glob statique pour le build/SSR et client (via code splitting)
//const translationData = import.meta.glob<Translation>("./i18n/**/*.json");
/*
// Deep merge pour les fallbacks (réutilisé de notre ancienne implémentation)
function deepMerge(obj1: any, obj2: any): any {
  const result = { ...obj1 };
  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (
        typeof obj2[key] === "object" &&
        obj2[key] !== null &&
        !Array.isArray(obj2[key])
      ) {
        result[key] = deepMerge(result[key] || {}, obj2[key]);
      } else {
        result[key] = obj2[key];
      }
    }
  }
  return result;
}

const loadTranslation$: LoadTranslationFn = server$(
  async (lang: string, asset: string) => {
    const defaultLang = config.defaultLocale.lang;

    // 1. Charger fallback (langue par défaut)
    let defaultData: Translation = {};
    if (lang !== defaultLang) {
      const defaultLoader =
        translationData[`./i18n/${defaultLang}/${asset}.json`];
      if (defaultLoader) defaultData = await defaultLoader();
    }

    // 2. Charger langue cible
    let langData: Translation = {};
    const targetLoader = translationData[`./i18n/${lang}/${asset}.json`];
    if (targetLoader) langData = await targetLoader();

    return deepMerge(defaultData, langData);
  }
);

export const translationFn: TranslationFn = {
  loadTranslation$,
};
*/
