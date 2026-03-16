import { component$, useSignal, $ } from "@builder.io/qwik";
import {
  routeLoader$,
  Link,
  type DocumentHead,
  type StaticGenerateHandler,
} from "@builder.io/qwik-city";
import { getList } from "~/services/lists";
import * as styles from "./result.css";

const TOTAL = 18;
const SITE_URL = "https://montpellier-en-commun.fr";

export const useCandidatesData = routeLoader$(async (ev) => {
  const score = parseInt(ev.params.score, 10);
  if (isNaN(score) || score < 0 || score > TOTAL) {
    throw ev.error(404, "Not found");
  }
  const [oziol, delafosse] = await Promise.all([
    getList("la-france-insoumise"),
    getList("michael-delafosse"),
  ]);

  const oziolPct = Math.round((score / TOTAL) * 100);
  const delaPct = 100 - oziolPct;
  // tie (score=9) → oziol wins, matching quiz logic (oziolCount >= delaCount)
  const winner =
    score >= TOTAL / 2 ? "la-france-insoumise" : "michael-delafosse";

  return {
    score,
    oziolPct,
    delaPct,
    winner,
    oziol: oziol
      ? {
          headOfList: oziol.headOfList,
          candidatePictureUrl: oziol.candidatePictureUrl,
          name: oziol.name,
        }
      : null,
    delafosse: delafosse
      ? {
          headOfList: delafosse.headOfList,
          candidatePictureUrl: delafosse.candidatePictureUrl,
          name: delafosse.name,
        }
      : null,
  };
});

export const onStaticGenerate: StaticGenerateHandler = () => ({
  params: Array.from({ length: TOTAL + 1 }, (_, i) => ({ score: String(i) })),
});

export const head: DocumentHead = ({ resolveValue }) => {
  const { score, oziolPct, delaPct, winner, oziol, delafosse } =
    resolveValue(useCandidatesData);
  const winnerName =
    winner === "la-france-insoumise"
      ? (oziol?.headOfList ?? "Nathalie Oziol")
      : (delafosse?.headOfList ?? "Michaël Delafosse");
  const winnerPct = winner === "la-france-insoumise" ? oziolPct : delaPct;
  const ogImage = `${SITE_URL}/og/quiz-result-${score}.png`;
  const pageUrl = `${SITE_URL}/si-tu-etais-maire/resultat/${score}/`;
  const title = `Je suis à ${winnerPct}\u00a0% en accord avec ${winnerName} — Et si tu étais maire\u00a0?`;
  const description = `Découvre quel·le candidat·e est le plus proche de tes idées pour les municipales de Montpellier 2026.`;

  return {
    title,
    meta: [
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: ogImage },
      { property: "og:type", content: "website" },
      { property: "og:url", content: pageUrl },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
  };
};

export default component$(() => {
  const data = useCandidatesData();
  const { score, oziolPct, delaPct, winner, oziol, delafosse } = data.value;

  const winnerData = winner === "la-france-insoumise" ? oziol : delafosse;
  const winnerName =
    winnerData?.headOfList ??
    (winner === "la-france-insoumise" ? "Nathalie Oziol" : "Michaël Delafosse");
  const winnerPct = winner === "la-france-insoumise" ? oziolPct : delaPct;

  const shareUrl = `${SITE_URL}/si-tu-etais-maire/resultat/${score}/?utm_source=share&utm_campaign=result_${score}`;
  const shareText = `Je suis à ${winnerPct}\u00a0% en accord avec ${winnerName} pour les municipales de Montpellier 2026. Et toi\u00a0?`;

  const showFallback = useSignal(false);
  const copied = useSignal(false);

  const handleShare$ = $(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          url: shareUrl,
          title: "Et si tu étais maire\u00a0?",
          text: shareText,
        });
        return;
      } catch {
        // fallthrough to show fallback
      }
    }
    showFallback.value = true;
  });

  const handleCopy$ = $(async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      copied.value = true;
    }
  });

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`;

  const oziolIsWinner = winner === "la-france-insoumise";

  return (
    <div class={styles.container}>
      {/* Share CTA */}
      <div class={styles.shareSection}>
        <button class={styles.sharePrimary} onClick$={handleShare$}>
          Partager mon résultat ↗
        </button>
        <div
          class={
            showFallback.value ? styles.shareFallbackVisible : styles.shareFallback
          }
        >
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            class={styles.shareLink}
          >
            Twitter / X
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            class={styles.shareLink}
          >
            WhatsApp
          </a>
          <button class={styles.shareLink} onClick$={handleCopy$}>
            {copied.value ? "Lien copié ✓" : "Copier le lien"}
          </button>
        </div>
      </div>

      {/* Results */}
      <h1 class={styles.resultsTitle}>Tes résultats</h1>

      <p class={styles.resultsSummary}>
        {oziolIsWinner && oziolPct === 50
          ? `Égalité\u00a0! Tu es autant en accord avec les deux candidat·e·s.`
          : oziolIsWinner
            ? `Tu es à ${oziolPct}\u00a0% en accord avec Nathalie Oziol sur les questions posées.`
            : `Tu es à ${delaPct}\u00a0% en accord avec Michaël Delafosse sur les questions posées.`}
      </p>

      {/* Oziol row */}
      <div
        class={[
          styles.candidateResultRow,
          oziolIsWinner && styles.candidateResultRowWinner,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {oziol?.candidatePictureUrl && (
          <img
            src={oziol.candidatePictureUrl}
            alt={oziol.headOfList}
            class={styles.candidatePicture}
            width="56"
            height="56"
          />
        )}
        <div class={styles.candidateInfo}>
          <p class={styles.candidateName}>
            {oziol?.headOfList ?? "Nathalie Oziol"}
            {oziolIsWinner && (
              <span class={styles.winnerBadge} style={{ marginLeft: "0.5rem" }}>
                Plus proche
              </span>
            )}
          </p>
          <div class={styles.scoreBar}>
            <div class={styles.scoreBarFill} style={{ width: `${oziolPct}%` }} />
          </div>
          <span class={styles.scorePercent}>{oziolPct}&nbsp;%</span>
        </div>
      </div>

      {/* Delafosse row */}
      <div
        class={[
          styles.candidateResultRow,
          !oziolIsWinner && styles.candidateResultRowWinner,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {delafosse?.candidatePictureUrl && (
          <img
            src={delafosse.candidatePictureUrl}
            alt={delafosse.headOfList}
            class={styles.candidatePicture}
            width="56"
            height="56"
          />
        )}
        <div class={styles.candidateInfo}>
          <p class={styles.candidateName}>
            {delafosse?.headOfList ?? "Michaël Delafosse"}
            {!oziolIsWinner && (
              <span class={styles.winnerBadge} style={{ marginLeft: "0.5rem" }}>
                Plus proche
              </span>
            )}
          </p>
          <div class={styles.scoreBar}>
            <div class={styles.scoreBarFill} style={{ width: `${delaPct}%` }} />
          </div>
          <span class={styles.scorePercent}>{delaPct}&nbsp;%</span>
        </div>
      </div>

      <Link
        href="/comparateur/?listes=la-france-insoumise,michael-delafosse"
        class={styles.ctaButton}
      >
        Comparer les programmes en détail →
      </Link>

      <Link href="/si-tu-etais-maire/" class={styles.retryButton}>
        Refaire le quiz →
      </Link>
    </div>
  );
});
