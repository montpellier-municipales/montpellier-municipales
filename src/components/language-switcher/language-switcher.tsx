import { $, component$, useSignal } from "@builder.io/qwik";
import { getLocale, _, locales, defaultLocale } from "compiled-i18n"; // Imports de compiled-i18n
import { useLocation, useNavigate } from "@builder.io/qwik-city";
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

export const LanguageSwitcher = component$(() => {
  // const t = inlineTranslate(); // Remplacé par _
  const currentLocale = getLocale(); // Utilisation de getLocale de compiled-i18n
  // const config = useSpeakConfig(); // Non nécessaire avec compiled-i18n
  const loc = useLocation();
  const navigate = useNavigate();
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
    // Sécurité renforcée
    if (typeof newValue !== "string" || !newValue) {
      return;
    }

    // 1. Vérifier si une URL spécifique est définie dans le mapping pour cette langue
    if (urlMapping[newValue]) {
      console.log("Using mapped URL from context:", urlMapping[newValue]);
      navigate(urlMapping[newValue]);
      return;
    }

    // 2. Sinon, Fallback sur la logique de remplacement de préfixe
    const getNewPath = (targetLang: string) => {
      let path = loc.url.pathname;

      // Nettoyer le chemin de tout préfixe de langue existant
      const currentLangPrefix = locales.find(
        (l) => path.startsWith(`/${l}/`) || path === `/${l}`
      );

      if (currentLangPrefix) {
        path = path.replace(`/${currentLangPrefix}`, "");
        if (path === "") path = "/";
      }

      // Construire le nouveau chemin
      if (targetLang !== defaultLocale) {
        // Utilisation de defaultLocale de compiled-i18n
        return `/${targetLang}${path === "/" ? "" : path}`;
      } else {
        return path;
      }
    };

    navigate(getNewPath(newValue));
  });

  return (
    <Select.Root bind:value={value} onChange$={handleChange} class={select}>
      <Select.Label style={{ display: "none" }}>
        {/* t("languageSwitcher.label") sera _("languageSwitcher.label") */}
        {_("languageSwitcher.label")}
      </Select.Label>

      <Select.Trigger class={selectTrigger}>
        {currentLocale === "oc" ? ( // Utilisation de locale.lang qui est getLocale()
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
        {locales.map(
          (
            l // Utilisation de locales de compiled-i18n
          ) => (
            <Select.Item key={l} value={l} class={popoverItem}>
              {l === "oc" ? (
                <Occitan height="18px" />
              ) : (
                <span>{getFlag(l)}</span>
              )}
              <Select.ItemLabel>{getLabel(l)}</Select.ItemLabel>
              <Spacer />
              <Select.ItemIndicator>
                {currentLocale === l ? "✓" : ""}
              </Select.ItemIndicator>
            </Select.Item>
          )
        )}
      </Select.Popover>
    </Select.Root>
  );
});
