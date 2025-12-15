import {
  component$,
  isDev,
  useSignal,
  useContextProvider,
  useVisibleTask$,
} from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { lightTheme, darkTheme } from "./theme.css";
import { ThemeContext } from "./routes/theme-context";
import "./global.css";
import { useQwikSpeak } from "qwik-speak";
import { config } from "./speak-config";
import { translationFn } from "./speak-functions";

export default component$(() => {
  // État du thème (par défaut light)
  const themeSignal = useSignal<"light" | "dark">("light");
  useQwikSpeak({ config, translationFn });

  // Au montage côté client, on vérifie la préférence ou le localStorage
  // useVisibleTask$ s'exécute uniquement dans le navigateur
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const key = "theme";
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => {
      const savedTheme = localStorage.getItem(key) as "light" | "dark";
      // Si l'utilisateur a forcé une préférence, on la respecte
      if (savedTheme) {
        themeSignal.value = savedTheme === "light" ? "light" : "dark";
      } else {
        // Sinon, on suit le système
        themeSignal.value = systemDark.matches ? "dark" : "light";
      }
    };

    // 1. Initialisation
    updateTheme();

    // 2. Écoute des changements système (ex: passage automatique en mode nuit de l'OS)
    const listener = () => {
      if (!localStorage.getItem(key)) {
        themeSignal.value = systemDark.matches ? "dark" : "light";
      }
    };

    systemDark.addEventListener("change", listener);

    // Nettoyage
    cleanup(() => systemDark.removeEventListener("change", listener));
  });

  useContextProvider(ThemeContext, {
    themeSig: themeSignal,
  });

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <RouterHead />
      </head>
      {/* Application dynamique de la classe de thème */}
      <body
        lang="en"
        class={themeSignal.value === "light" ? lightTheme : darkTheme}
      >
        <RouterOutlet />
        {!isDev && <ServiceWorkerRegister />}
      </body>
    </QwikCityProvider>
  );
});
