import { component$ } from "@builder.io/qwik";
import {
  routeLoader$,
  Link,
  type DocumentHead,
  type StaticGenerateHandler,
} from "@builder.io/qwik-city";
import { getAllCharters } from "~/services/charters";
import { getAllLists } from "~/services/lists";
import * as styles from "./charters.css";
import { inlineTranslate, useSpeak } from "qwik-speak";
import { LuCheckCircle, LuXCircle, LuExternalLink } from "@qwikest/icons/lucide";

export const useChartersData = routeLoader$(async () => {
  const [charters, allLists] = await Promise.all([
    Promise.resolve(getAllCharters()),
    getAllLists(),
  ]);
  const lists = allLists.map((l) => ({
    id: l.id,
    name: l.name,
    headOfList: l.headOfList,
    logoUrl: l.logoUrl,
  }));
  return { charters, lists };
});

export default component$(() => {
  useSpeak({ assets: ["charters"] });
  const t = inlineTranslate();
  const data = useChartersData();
  const { charters, lists } = data.value;

  return (
    <div class={styles.container}>
      <header class={styles.header}>
        <h1 class={styles.title}>{t("charters.title")}</h1>
        <p class={styles.description}>{t("charters.description")}</p>
      </header>

      <div class={styles.tableWrapper}>
        <table class={styles.table}>
          <thead>
            <tr class={styles.theadRow}>
              <th class={styles.thCharter}>{t("charters.title")}</th>
              {lists.map((list) => (
                <th key={list.id} class={styles.thCandidate}>
                  <img
                    src={list.logoUrl}
                    alt={list.name}
                    class={styles.candidateLogoImg}
                    width={40}
                    height={40}
                  />
                  <span class={styles.candidateName}>{list.name}</span>
                  <span class={styles.headOfList}>{list.headOfList}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {charters.map((charter) => (
              <tr key={charter.id} class={styles.row}>
                <td class={styles.tdCharter}>
                  <div class={styles.charterOrg}>{charter.organization}</div>
                  <div class={styles.charterTitle}>{charter.title}</div>
                  <p class={styles.charterDesc}>{charter.description}</p>
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <Link href={`/comparateur/chartes/${charter.slug}/`} class={styles.charterLink}>
                      {t("charters.measureDetail")} →
                    </Link>
                    {charter.externalUrl && (
                      <a
                        href={charter.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        class={styles.charterLink}
                      >
                        {t("charters.externalSource")} <LuExternalLink style={{ verticalAlign: "middle" }} />
                      </a>
                    )}
                  </div>
                </td>
                {lists.map((list) => {
                  const signatory = charter.signatories.find(
                    (s) => s.candidateId === list.id,
                  );
                  if (!signatory) {
                    return (
                      <td key={list.id} class={styles.tdCell}>
                        <span class={styles.notSignedBadge} title={t("charters.noResponse")}>
                          —
                        </span>
                      </td>
                    );
                  }
                  if (charter.measures.length === 0) {
                    // Simple yes/no charter
                    return (
                      <td key={list.id} class={styles.tdCell}>
                        {signatory.signed ? (
                          <span class={styles.signedBadge} title={t("charters.signed")}>
                            <LuCheckCircle />
                          </span>
                        ) : (
                          <span class={styles.notSignedBadge} title={t("charters.notSigned")}>
                            <LuXCircle />
                          </span>
                        )}
                      </td>
                    );
                  }
                  // Measure-based charter
                  const total = charter.measures.length;

                  // If any measure defines goodResponse, count by alignment with measureResponses
                  const hasGoodResponses = charter.measures.some((m) => m.goodResponse != null);
                  const alignedCount =
                    hasGoodResponses && signatory.measureResponses != null
                      ? charter.measures.filter(
                          (m) =>
                            m.goodResponse != null &&
                            signatory.measureResponses![m.id] === m.goodResponse,
                        ).length
                      : null;

                  const knownCount = signatory.signedMeasureIds.length;
                  const displayCount = alignedCount ?? signatory.signedCount ?? knownCount;
                  if (!signatory.signed && displayCount === 0) {
                    return (
                      <td key={list.id} class={styles.tdCell}>
                        <span class={styles.notSignedBadge} title={t("charters.notSigned")}>
                          <LuXCircle />
                        </span>
                      </td>
                    );
                  }
                  if (displayCount === total) {
                    return (
                      <td key={list.id} class={styles.tdCell}>
                        <span class={styles.signedBadge} title={t("charters.signed")}>
                          <LuCheckCircle />
                        </span>
                      </td>
                    );
                  }
                  return (
                    <td key={list.id} class={styles.tdCell}>
                      <span class={styles.partialBadge}>
                        {displayCount}/{total}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p class={styles.note}>
        Les données sont issues des engagements publics des listes candidates. Les réponses marquées ✗ indiquent soit un refus explicite, soit l'absence de réponse au moment de la publication.
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
  return { params: [{}] };
};
