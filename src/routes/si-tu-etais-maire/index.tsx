import { component$, useStore, useVisibleTask$, $ } from "@builder.io/qwik";
import { routeLoader$, Link, type DocumentHead } from "@builder.io/qwik-city";
import { getList } from "~/services/lists";
import { QUESTIONS } from "./questions";
import * as styles from "./quiz.css";

export const useCandidatesData = routeLoader$(async () => {
  const [oziol, delafosse] = await Promise.all([
    getList("la-france-insoumise"),
    getList("michael-delafosse"),
  ]);
  return {
    "la-france-insoumise": oziol
      ? {
          headOfList: oziol.headOfList,
          candidatePictureUrl: oziol.candidatePictureUrl,
          name: oziol.name,
        }
      : null,
    "michael-delafosse": delafosse
      ? {
          headOfList: delafosse.headOfList,
          candidatePictureUrl: delafosse.candidatePictureUrl,
          name: delafosse.name,
        }
      : null,
  };
});

export default component$(() => {
  const candidatesData = useCandidatesData();

  const state = useStore<{
    phase: "playing" | "results";
    current: number;
    answers: string[];
    selectedId: string | null;
    shuffledOptions: (typeof QUESTIONS)[0]["options"] | null;
  }>({
    phase: "playing",
    current: 0,
    answers: [],
    selectedId: null,
    shuffledOptions: null,
  });

  // Shuffle options once per question
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => state.current);
    const opts = [
      ...QUESTIONS[state.current].options,
    ] as (typeof QUESTIONS)[0]["options"];
    if (Math.random() > 0.5) opts.reverse();
    state.shuffledOptions = opts;
    state.selectedId = null;
  });

  const handleSelect = $((candidateId: string) => {
    if (state.selectedId !== null) return;
    state.selectedId = candidateId;
  });

  const handleNext = $(() => {
    if (state.selectedId === null) return;
    const newAnswers = [...state.answers, state.selectedId];
    state.answers = newAnswers;
    state.shuffledOptions = null;

    // Track the answer for this question
    if (typeof window !== "undefined" && (window as any).plausible) {
      (window as any).plausible("Quiz_Answer", {
        props: {
          question: state.current + 1,
          choice:
            state.selectedId === "la-france-insoumise" ? "oziol" : "delafosse",
        },
      });
    }

    if (state.current < QUESTIONS.length - 1) {
      state.current = state.current + 1;
    } else {
      // Last question — also track final result
      const total = newAnswers.length;
      const oziolCount = newAnswers.filter(
        (id) => id === "la-france-insoumise",
      ).length;
      const delaCount = newAnswers.filter(
        (id) => id === "michael-delafosse",
      ).length;
      const winner = oziolCount >= delaCount ? "oziol" : "delafosse";
      if (typeof window !== "undefined" && (window as any).plausible) {
        (window as any).plausible("Quiz_Result", {
          props: {
            winner,
            oziol_pct: Math.round((oziolCount / total) * 100),
            delafosse_pct: Math.round((delaCount / total) * 100),
          },
        });
      }
      state.phase = "results";
    }
  });

  const currentQuestion = QUESTIONS[state.current];
  const isLastQuestion = state.current === QUESTIONS.length - 1;
  const progress = ((state.current + 1) / QUESTIONS.length) * 100;

  // Results
  const oziolCount = state.answers.filter(
    (id) => id === "la-france-insoumise",
  ).length;
  const delaCount = state.answers.filter(
    (id) => id === "michael-delafosse",
  ).length;
  const total = state.answers.length;

  const oziolPct = total > 0 ? Math.round((oziolCount / total) * 100) : 0;
  const delaPct = total > 0 ? Math.round((delaCount / total) * 100) : 0;

  const winner =
    oziolCount >= delaCount ? "la-france-insoumise" : "michael-delafosse";

  const oziolData = candidatesData.value["la-france-insoumise"];
  const delaData = candidatesData.value["michael-delafosse"];

  return (
    <div class={styles.container}>
      {state.phase === "playing" && (
        <>
          {/* Progress */}
          <div>
            <div class={styles.progressBarWrapper}>
              <div
                class={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p class={styles.progressLabel}>
              Question {state.current + 1} / {QUESTIONS.length}
            </p>
          </div>

          {/* Question */}
          <p class={styles.questionText}>{currentQuestion.question}</p>

          {/* Options */}
          <div class={styles.optionsGrid}>
            {(state.shuffledOptions ?? currentQuestion.options).map(
              (option) => {
                const isSelected = state.selectedId === option.candidateId;
                const isOther =
                  state.selectedId !== null &&
                  state.selectedId !== option.candidateId;

                return (
                  <button
                    key={`${state.current}-${option.candidateId}`}
                    class={[
                      styles.optionCard,
                      isSelected && styles.optionCardSelected,
                      isOther && styles.optionCardOther,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick$={() => handleSelect(option.candidateId)}
                  >
                    <p class={styles.optionTitle}>{option.title}</p>
                    <p class={styles.optionContent}>{option.content}</p>
                    {/* Reveal candidate only after selection */}
                    {state.selectedId !== null && (
                      <span class={styles.candidateTag}>
                        {option.candidateId === "la-france-insoumise"
                          ? "Nathalie Oziol (LFI)"
                          : "Michaël Delafosse"}
                      </span>
                    )}
                  </button>
                );
              },
            )}
          </div>

          {/* Next button */}
          {state.selectedId !== null && (
            <div class={styles.nextButtonRow}>
              <button class={styles.nextButton} onClick$={handleNext}>
                {isLastQuestion ? "Voir mes résultats →" : "Suivant →"}
              </button>
            </div>
          )}
        </>
      )}

      {state.phase === "results" && (
        <div class={styles.resultsSection}>
          <h1 class={styles.resultsTitle}>Tes résultats</h1>

          <p class={styles.resultsSummary}>
            {oziolCount > delaCount
              ? `Tu es à ${oziolPct}\u00a0% en accord avec Nathalie Oziol sur les questions posées.`
              : oziolCount < delaCount
                ? `Tu es à ${delaPct}\u00a0% en accord avec Michaël Delafosse sur les questions posées.`
                : `Égalité\u00a0! Tu es autant en accord avec les deux candidats.`}
          </p>

          {/* Oziol row */}
          <div
            class={[
              styles.candidateResultRow,
              winner === "la-france-insoumise" &&
                styles.candidateResultRowWinner,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {oziolData?.candidatePictureUrl && (
              <img
                src={oziolData.candidatePictureUrl}
                alt={oziolData.headOfList}
                class={styles.candidatePicture}
                width="56"
                height="56"
              />
            )}
            <div class={styles.candidateInfo}>
              <p class={styles.candidateName}>
                {oziolData?.headOfList ?? "Nathalie Oziol"}
                {winner === "la-france-insoumise" && (
                  <span
                    class={styles.winnerBadge}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Plus proche
                  </span>
                )}
              </p>
              <div class={styles.scoreBar}>
                <div
                  class={styles.scoreBarFill}
                  style={{ width: `${oziolPct}%` }}
                />
              </div>
              <span class={styles.scorePercent}>{oziolPct}&nbsp;%</span>
            </div>
          </div>

          {/* Delafosse row */}
          <div
            class={[
              styles.candidateResultRow,
              winner === "michael-delafosse" && styles.candidateResultRowWinner,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {delaData?.candidatePictureUrl && (
              <img
                src={delaData.candidatePictureUrl}
                alt={delaData.headOfList}
                class={styles.candidatePicture}
                width="56"
                height="56"
              />
            )}
            <div class={styles.candidateInfo}>
              <p class={styles.candidateName}>
                {delaData?.headOfList ?? "Michaël Delafosse"}
                {winner === "michael-delafosse" && (
                  <span
                    class={styles.winnerBadge}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Plus proche
                  </span>
                )}
              </p>
              <div class={styles.scoreBar}>
                <div
                  class={styles.scoreBarFill}
                  style={{ width: `${delaPct}%` }}
                />
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
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Si tu étais maire… | Municipales Montpellier 2026",
  meta: [
    {
      name: "description",
      content:
        "Réponds à ces questions et découvre quel candidat aux municipales de Montpellier 2026 est le plus proche de tes idées.",
    },
  ],
};
