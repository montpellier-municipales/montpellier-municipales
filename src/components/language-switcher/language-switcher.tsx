import { $, component$, useSignal } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { Select } from "@qwik-ui/headless";
import { LuChevronDown } from "@qwikest/icons/lucide";
import {
  iconContainer,
  popover,
  popoverItem,
  select,
  selectTrigger,
} from "./language-switcher.css";
import Occitan from "~/static/oc.svg?jsx";
import { Spacer } from "../spacer";
import { useUrlMapping } from "~/routes/url-mapping-context";
import { Language } from "~/types/schema.zod";
import { inlineTranslate, localizePath } from "qwik-speak";
import { config } from "~/speak-config";

export const LanguageSwitcher = component$(() => {
  const loc = useLocation();
  const t = inlineTranslate();
  const currentLocale = (loc.params.lang as Language) || Language.fr;
  const urlMapping = useUrlMapping(); // Récupérer le mapping contextuel

  // On initialise avec la langue courante
  const value = useSignal<string>(currentLocale);

  const getFlag = (lang: string) => {
    switch (lang) {
      case "fr":
        return "🇫🇷";
      case "ar":
        return "🇦🇪";
      case "en":
        return "🇬🇧";
      case "es":
        return "🇪🇸";
      case "oc":
        return "Occitan";
      default:
        return "";
    }
  };

  const getLabel = (lang: string) => {
    switch (lang) {
      case "fr":
        return "Français";
      case "oc":
        return "Occitan";
      case "ar":
        return "العربية";
      case "en":
        return "English";
      case "es":
        return "Español";
      default:
        return lang;
    }
  };

  const handleChange = $((newValue: string) => {
    const getPath = localizePath();
    if (typeof window === "undefined") return;

    // 1. Vérifier si une URL spécifique est définie dans le mapping pour cette langue
    if (urlMapping[newValue]) {
      window.location.href = urlMapping[newValue];
      return;
    }

    // 2. Sinon, Fallback sur la logique de remplacement de préfixe
    const pathname = loc.url.pathname;
    window.location.href = getPath(pathname, newValue);
  });

  return (
    <Select.Root bind:value={value} onChange$={handleChange} class={select}>
      <Select.Label style={{ display: "none" }}>
        {t("languageSwitcher.label")}
      </Select.Label>

      <Select.Trigger class={selectTrigger}>
        {currentLocale === "oc" ? (
          <Occitan height="18px" />
        ) : (
          <span>{getFlag(currentLocale)}</span>
        )}
        <Select.DisplayValue placeholder={getLabel(currentLocale)} />
        <Spacer />
        <span class={iconContainer}>
          <LuChevronDown height="24px" />
        </span>
      </Select.Trigger>

      <Select.Popover class={popover}>
        {config.supportedLocales.map((locale) => (
          <Select.Item
            key={locale.lang}
            value={locale.lang}
            class={popoverItem}
          >
            {locale.lang === "oc" ? (
              <Occitan height="18px" />
            ) : (
              <span>{getFlag(locale.lang)}</span>
            )}
            <Select.ItemLabel>{getLabel(locale.lang)}</Select.ItemLabel>
            <Spacer />
            <Select.ItemIndicator>
              {currentLocale === locale.lang ? "✓" : ""}
            </Select.ItemIndicator>
          </Select.Item>
        ))}
      </Select.Popover>
    </Select.Root>
  );
});
