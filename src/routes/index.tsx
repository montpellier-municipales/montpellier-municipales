import { component$ } from "@builder.io/qwik";
import { routeLoader$, Link, type DocumentHead } from "@builder.io/qwik-city";
import { getAllLists } from "~/services/lists";
import * as styles from "./home.css";
import { inlineTranslate, useSpeak } from "qwik-speak";
import { Countdown } from "~/components/countdown/countdown";

// Chargement des données côté serveur
export const useLists = routeLoader$(async () => {
  return await getAllLists();
});

export default component$(() => {
  useSpeak({ assets: ["home"] });

  const t = inlineTranslate();
  const lists = useLists();

  return (
    <div class={styles.container}>
      <header class={styles.hero}>
        <h1 class={styles.title}>{t("home.heroTitle")}</h1>
        <p class={styles.subtitle}>{t("home.heroSubtitle")}</p>
      </header>

      <Countdown />

      <div class={styles.grid}>
        {lists.value.map((list) => (
          <Link key={list.id} href={`/listes/${list.id}`} class={styles.card}>
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
