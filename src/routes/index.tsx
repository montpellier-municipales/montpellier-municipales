import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { routeLoader$, Link, type DocumentHead } from "@builder.io/qwik-city";
import { getAllLists } from "~/services/lists";
import * as styles from "./home.css";
import { inlineTranslate, useSpeak, useSpeakContext } from "qwik-speak";
import { Countdown } from "~/components/countdown/countdown";
import { config } from "~/speak-config";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { marked } from "marked";
import { markdownRenderer } from "~/utils";

const HOME_CONTENT_DIR = join(process.cwd(), "src/content/home");

const enum Components {
  COUNTDOWN = "countdown",
  CANDIDATS = "candidats",
}

export const useHomeContent = routeLoader$(
  async ({ locale }): Promise<(Components | string)[]> => {
    const lang = locale() || config.defaultLocale.lang;
    // Fallback to default lang if file doesn't exist?
    let filePath = join(HOME_CONTENT_DIR, `${lang}.md`);

    // Simple check or try/catch
    try {
      await readFile(filePath);
    } catch {
      filePath = join(HOME_CONTENT_DIR, `${config.defaultLocale.lang}.md`);
    }

    try {
      const fileContent = await readFile(filePath, "utf-8");
      const htmlContent = await marked.parse(fileContent, {
        renderer: markdownRenderer,
      });
      const parts = htmlContent.split("<!-- candidates -->", 2);
      const { beforeCandidates, afterCandidates } = {
        beforeCandidates: parts[0] || "",
        afterCandidates: parts[1] || "",
      };
      const beforeSplit = beforeCandidates.split("<!-- countdown -->", 2);
      if (beforeSplit.length === 2) {
        return [
          beforeSplit[0],
          Components.COUNTDOWN,
          beforeSplit[1],
          Components.CANDIDATS,
          afterCandidates,
        ];
      } else {
        const afterSplit = beforeCandidates.split("<!-- countdown -->", 2);
        if (afterSplit.length === 2) {
          return [
            beforeCandidates,
            Components.CANDIDATS,
            afterSplit[0],
            Components.COUNTDOWN,
            afterSplit[1],
          ];
        }
        return [beforeCandidates, Components.CANDIDATS, afterCandidates];
      }
    } catch (error) {
      console.error("Error loading home content:", error);
      return [];
    }
  }
);

// Chargement des données côté serveur
export const useLists = routeLoader$(async () => {
  return await getAllLists();
});

export default component$(() => {
  useSpeak({ assets: ["home"] });

  const t = inlineTranslate();
  const lists = useLists();
  const content = useHomeContent();
  const ctx = useSpeakContext();
  const lang = ctx.locale.lang;

  // Redirection automatique côté client basée sur la langue du navigateur
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    // On ne redirige que si on est sur la racine (langue par défaut)
    if (typeof window === "undefined") return;
    if (lang === config.defaultLocale.lang) {
      const browserLang = navigator.language.split("-")[0];

      // On vérifie si on a déjà redirigé l'utilisateur durant cette session
      const hasRedirected = sessionStorage.getItem("lang-redirect");

      if (!hasRedirected && browserLang !== config.defaultLocale.lang) {
        // Vérifie si la langue du navigateur est supportée
        const isSupported = config.supportedLocales.some(
          (l) => l.lang === browserLang
        );

        if (isSupported) {
          sessionStorage.setItem("lang-redirect", "true");

          window.location.href = `/${browserLang}/`;
        }
      }
    }
  });

  const getLocalizedLink = (path: string) => {
    return lang === config.defaultLocale.lang ? path : `/${lang}${path}`;
  };

  return (
    <div class={styles.container}>
      {content.value.map((section, i) => {
        if (section === Components.COUNTDOWN) {
          return <Countdown key="countdown" />;
        }
        if (section === Components.CANDIDATS) {
          return (
            <div key="candidats" class={styles.grid}>
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
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span>{t("home.noImage")}</span>
                    )}
                  </div>

                  <div class={styles.cardContent}>
                    <h2 class={styles.cardTitle}>{list.name}</h2>
                    <p class={styles.cardSubtitle}>
                      {t("home.headOfList")} :{" "}
                      <strong>{list.headOfList}</strong>
                    </p>

                    <div>
                      {list.parties.slice(0, 3).map((party) => (
                        <span key={party} class={styles.tag}>
                          {party}
                        </span>
                      ))}
                      {list.parties.length > 3 && (
                        <span class={styles.tag}>
                          +{list.parties.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          );
        }
        return (
          <div
            key={i}
            class={styles.textSection}
            dangerouslySetInnerHTML={section}
          />
        );
      })}
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
