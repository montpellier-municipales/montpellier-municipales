import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { routeLoader$, Link, type DocumentHead, useNavigate } from "@builder.io/qwik-city";
import { getAllLists } from "~/services/lists";
import * as styles from "./home.css";
import { inlineTranslate, useSpeak, useSpeakContext } from "qwik-speak";
import { Countdown } from "~/components/countdown/countdown";
import { config } from "~/speak-config";

// Chargement des données côté serveur
export const useLists = routeLoader$(async () => {
  return await getAllLists();
});

export default component$(() => {
  useSpeak({ assets: ["home"] });

  const t = inlineTranslate();
  const lists = useLists();
  const ctx = useSpeakContext();
  const lang = ctx.locale.lang;
  const nav = useNavigate();

  // Redirection automatique côté client basée sur la langue du navigateur
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    // On ne redirige que si on est sur la racine (langue par défaut)
    if (lang === config.defaultLocale.lang) {
      const browserLang = navigator.language.split("-")[0];
      
      // On vérifie si on a déjà redirigé l'utilisateur durant cette session
      const hasRedirected = sessionStorage.getItem("lang-redirect");

      if (!hasRedirected && browserLang !== config.defaultLocale.lang) {
        // Vérifie si la langue du navigateur est supportée
        const isSupported = config.supportedLocales.some(l => l.lang === browserLang);
        
        if (isSupported) {
          sessionStorage.setItem("lang-redirect", "true");
          nav(`/${browserLang}/`);
        }
      }
    }
  });

  const getLocalizedLink = (path: string) => {
    return lang === config.defaultLocale.lang ? path : `/${lang}${path}`;
  };

  return (
    <div class={styles.container}>
      <header class={styles.hero}>
        <h1 class={styles.title}>{t("home.heroTitle")}</h1>
        <p class={styles.subtitle}>{t("home.heroSubtitle")}</p>
      </header>

      <Countdown />

      <div class={styles.grid}>
        {lists.value.map((list) => (
          <Link
            key={list.id}
            href={getLocalizedLink(`/listes/${list.id}`)}
            class={styles.card}
          >
            {/* Image Placeholder ou réelle */}
            <div class={styles.cardImage}>
              {list.logoUrl ? (
                // eslint-disable-next-line qwik/jsx-img
                <img
                  src={list.candidatePictureUrl}
                  alt={`Logo ${list.name}`}
                  height="200"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span>{t("home.noImage")}</span>
              )}
            </div>

            <div class={styles.cardContent}>
              <h2 class={styles.cardTitle}>{list.name}</h2>
              <p class={styles.cardSubtitle}>
                {t("home.headOfList")} : <strong>{list.headOfList}</strong>
              </p>

              <div>
                {list.parties.slice(0, 3).map((party) => (
                  <span key={party} class={styles.tag}>
                    {party}
                  </span>
                ))}
                {list.parties.length > 3 && (
                  <span class={styles.tag}>+{list.parties.length - 3}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});

export const head: DocumentHead = () => {
  const t = inlineTranslate();
  return {
    title: t("home.heroTitle"),
    meta: [
      {
        name: "description",
        content: t("home.heroSubtitle"),
      },
    ],
  };
};
