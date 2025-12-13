import { component$ } from "@builder.io/qwik";
import { routeLoader$, StaticGenerateHandler } from "@builder.io/qwik-city";
import { getList, getAllLists } from "~/services/lists";
import { getLocale } from "compiled-i18n"; // Import de getLocale
import * as styles from "./list-details.css";
import { marked } from "marked";
import { Language } from "~/types/schema";

// Loader pour récupérer les données côté serveur
export const useListDetails = routeLoader$(async (requestEvent) => {
  const listId = requestEvent.params.id;
  const list = await getList(listId);

  if (!list) {
    throw requestEvent.fail(404, {
      errorMessage: "Liste non trouvée",
    });
  }
  const presentation = list.presentation
    ? (
        await Promise.all(
          Object.entries(list.presentation).map(
            async ([language, presentationMd]) => {
              const localPresentation = await marked.parse(presentationMd);
              return { [language]: localPresentation };
            }
          )
        )
      ).reduce((acc, pres) => {
        return Object.assign(acc, pres);
      }, {})
    : {};
  const vision = list.vision
    ? (
        await Promise.all(
          Object.entries(list.vision).map(async ([language, visionMd]) => {
            const localeVision = await marked.parse(visionMd);
            return { [language]: localeVision };
          })
        )
      ).reduce((acc, pres) => {
        return Object.assign(acc, pres);
      }, {})
    : {};

  return { ...list, presentation, vision };
});

export default component$(() => {
  const list = useListDetails();
  const currentLocale = getLocale() as Language; // Utilisation de getLocale de compiled-i18n

  return (
    <div class={styles.container}>
      <header class={styles.header}>
        {/* Placeholder image si pas d'image réelle */}
        <div class={styles.logo}>
          {list.value.logoUrl ? (
            // eslint-disable-next-line qwik/jsx-img
            <img
              src={list.value.logoUrl}
              alt={`Logo ${list.value.name}`}
              style={{ maxWidth: 120, maxHeight: 120 }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
              }}
            >
              Logo
            </div>
          )}
        </div>

        <div>
          <h1 class={styles.title}>{list.value.name}</h1>
          <p class={styles.subtitle}>Tête de liste : {list.value.headOfList}</p>
          <div style={{ marginTop: "0.5rem" }}>
            {list.value.parties.map((party) => (
              <span
                key={party}
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.5rem",
                  backgroundColor: "#eee",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                  marginRight: "0.5rem",
                }}
              >
                {party}
              </span>
            ))}
          </div>
        </div>
      </header>

      <section
        dangerouslySetInnerHTML={list.value.presentation?.[currentLocale]}
      ></section>

      <section
        dangerouslySetInnerHTML={list.value.vision?.[currentLocale]}
      ></section>

      <section class={styles.programSection}>
        <h2>Programme (Extrait)</h2>

        {list.value.program.map((point) => (
          <article key={point.themeId} class={styles.themeCard}>
            <h3 class={styles.themeTitle}>Thème : {point.themeId}</h3>
            <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
              {point.summary[currentLocale] || point.summary["fr"]}
            </p>
            <div style={{ color: "#555", lineHeight: "1.6" }}>
              {point.details[currentLocale] || point.details["fr"]}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
});

// SSG : Génération statique pour les Listes (Français)
export const onStaticGenerate: StaticGenerateHandler = async () => {
  const lists = await getAllLists();
  return {
    params: lists.map((list) => ({
      id: list.id,
    })),
  };
};
