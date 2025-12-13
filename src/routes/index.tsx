import { component$ } from "@builder.io/qwik";
import { routeLoader$, Link, type DocumentHead } from "@builder.io/qwik-city";
import { getAllLists } from "~/services/lists";
import { _ } from "compiled-i18n";
import * as styles from "./home.css";

// Chargement des données côté serveur
export const useLists = routeLoader$(async () => {
  return await getAllLists();
});

export default component$(() => {
  const lists = useLists();

  return (
    <div class={styles.container}>
      <header class={styles.hero}>
        <h1 class={styles.title}>{_("home.heroTitle")}</h1>
        <p class={styles.subtitle}>{_("home.heroSubtitle")}</p>
      </header>

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
                <span>{_("home.noImage")}</span>
              )}
            </div>

            <div class={styles.cardContent}>
              <h2 class={styles.cardTitle}>{list.name}</h2>
              <p class={styles.cardSubtitle}>
                {_("home.headOfList")} : <strong>{list.headOfList}</strong>
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

export const head: DocumentHead = {
  title: "Montpellier Municipales 2026 - Comparateur",
  meta: [
    {
      name: "description",
      content:
        "Site comparatif des programmes pour les élections municipales de Montpellier 2026.",
    },
  ],
};
