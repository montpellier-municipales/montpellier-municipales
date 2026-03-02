import { component$ } from "@builder.io/qwik";
import {
  routeLoader$,
  Link,
  type DocumentHead,
  type StaticGenerateHandler,
} from "@builder.io/qwik-city";
import { getCharter, getAllCharters } from "~/services/charters";
import { getAllLists } from "~/services/lists";
import * as styles from "./charter-detail.css";
import { inlineTranslate, useSpeak } from "qwik-speak";
import {
  LuCheckCircle,
  LuXCircle,
  LuExternalLink,
} from "@qwikest/icons/lucide";

export const useCharterData = routeLoader$(async ({ params, status }) => {
  const charter = getCharter(params.slug);
  if (!charter) {
    status(404);
    return null;
  }
  const allLists = await getAllLists();
  const lists = allLists.map((l) => ({
    id: l.id,
    name: l.name,
    headOfList: l.headOfList,
    logoUrl: l.logoUrl,
  }));
  return { charter, lists };
});

export default component$(() => {
  useSpeak({ assets: ["charters"] });
  const t = inlineTranslate();
  const data = useCharterData();

  if (!data.value) {
    return <div class={styles.container}>Charte introuvable.</div>;
  }

  const { charter, lists } = data.value;

  // Group measures by theme
  const themes: { name: string; measures: typeof charter.measures }[] = [];
  const seenThemes = new Set<string>();
  for (const measure of charter.measures) {
    const theme = measure.theme ?? "";
    if (!seenThemes.has(theme)) {
      seenThemes.add(theme);
      themes.push({ name: theme, measures: [] });
    }
    themes.find((th) => th.name === theme)!.measures.push(measure);
  }

  const hasMeasures = charter.measures.length > 0;

  return (
    <div class={styles.container}>
      <Link href="/comparateur/chartes/" class={styles.backLink}>
        {t("charters.back")}
      </Link>

      <header class={styles.header}>
        <div class={styles.org}>{charter.organization}</div>
        <h1 class={styles.title}>{charter.title}</h1>
        <p class={styles.description}>{charter.description}</p>
        {charter.externalUrl && (
          <a
            href={charter.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            class={styles.externalLink}
          >
            {t("charters.externalSource")} <LuExternalLink />
          </a>
        )}
      </header>

      {!hasMeasures && (
        <>
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: "700",
              color: "var(--color-title)",
            }}
          >
            {t("charters.signatories")}
          </h2>
          <div class={styles.signatoryGrid}>
            {lists.map((list) => {
              const signatory = charter.signatories.find(
                (s) => s.candidateId === list.id,
              );
              const signed = signatory?.signed ?? false;
              return (
                <div
                  key={list.id}
                  class={
                    signed ? styles.signatoryCardSigned : styles.signatoryCard
                  }
                >
                  <img
                    src={list.logoUrl}
                    alt={list.name}
                    class={styles.signatoryLogoImg}
                    width={56}
                    height={56}
                  />
                  <span class={styles.signatoryName}>{list.name}</span>
                  <span class={styles.headOfList}>{list.headOfList}</span>
                  <i class={styles.spacer} />
                  {signed ? (
                    <span class={styles.signedLabel}>
                      {t("charters.signed")}
                    </span>
                  ) : (
                    <span class={styles.notSignedLabel}>
                      {t("charters.notSigned")}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {hasMeasures && (
        <>
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: "700",
              color: "var(--color-title)",
            }}
          >
            {t("charters.measureDetail")}
          </h2>
          <div class={styles.tableWrapper}>
            <table class={styles.table}>
              <thead>
                <tr class={styles.theadRow}>
                  <th class={styles.thMeasure}>{t("charters.measures")}</th>
                  {lists.map((list) => (
                    <th key={list.id} class={styles.thCandidate}>
                      <img
                        src={list.logoUrl}
                        alt={list.name}
                        class={styles.candidateLogoImg}
                        width={36}
                        height={36}
                      />
                      <span class={styles.candidateName}>{list.name}</span>
                      <span class={styles.headOfList}>{list.headOfList}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {themes.map((theme) => (
                  <>
                    {theme.name && (
                      <tr key={`theme-${theme.name}`} class={styles.themeRow}>
                        <td class={styles.themeCell} colSpan={lists.length + 1}>
                          {theme.name}
                        </td>
                      </tr>
                    )}
                    {theme.measures.map((measure) => (
                      <tr key={measure.id} class={styles.measureRow}>
                        <td class={styles.tdMeasure}>
                          <span class={styles.measureNumber}>
                            {charter.measures.indexOf(measure) + 1}.
                          </span>
                          {measure.title}
                        </td>
                        {lists.map((list) => {
                          const signatory = charter.signatories.find(
                            (s) => s.candidateId === list.id,
                          );
                          if (!signatory) {
                            return (
                              <td key={list.id} class={styles.tdCell}>
                                <span class={styles.unknownIcon}>—</span>
                              </td>
                            );
                          }
                          // If signedCount is set but no specific IDs, show unknown
                          if (
                            signatory.signed &&
                            signatory.signedMeasureIds.length === 0 &&
                            signatory.signedCount != null
                          ) {
                            return (
                              <td key={list.id} class={styles.tdCell}>
                                <span
                                  class={styles.unknownIcon}
                                  title="Mesures spécifiques non communiquées"
                                >
                                  ?
                                </span>
                              </td>
                            );
                          }
                          const signed = signatory.signedMeasureIds.includes(
                            measure.id,
                          );
                          return (
                            <td key={list.id} class={styles.tdCell}>
                              {signed ? (
                                <LuCheckCircle class={styles.checkIcon} />
                              ) : (
                                <LuXCircle class={styles.crossIcon} />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <p class={styles.note}>
        Les données sont issues des engagements publics des listes candidates. ✗
        indique un refus explicite ou l'absence de réponse. ? indique que le
        candidat a signé un certain nombre de mesures mais que le détail n'est
        pas disponible.
      </p>
    </div>
  );
});

export const head: DocumentHead = () => {
  const t = inlineTranslate();
  return {
    title: t("charters.title"),
    meta: [
      {
        name: "description",
        content: t("charters.metaDescription"),
      },
    ],
  };
};

export const onStaticGenerate: StaticGenerateHandler = async () => {
  const charters = getAllCharters();
  return {
    params: charters.map((c) => ({ slug: c.slug })),
  };
};
