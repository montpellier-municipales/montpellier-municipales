import { component$, useStore, useVisibleTask$, $ } from "@builder.io/qwik";
import { useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import { QUESTIONS } from "./questions";
import * as styles from "./quiz.css";

export default component$(() => {
  const nav = useNavigate();

  const state = useStore<{
    phase: "intro" | "playing";
    current: number;
    answers: string[];
    selectedId: string | null;
    shuffledOptions: (typeof QUESTIONS)[0]["options"] | null;
  }>({
    phase: "intro",
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

  const handleNext = $(async () => {
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
      // Last question — track final result then navigate to result page
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
      await nav(`/si-tu-etais-maire/resultat/${oziolCount}/`);
    }
  });

  const currentQuestion = QUESTIONS[state.current];
  const isLastQuestion = state.current === QUESTIONS.length - 1;
  const progress = ((state.current + 1) / QUESTIONS.length) * 100;

  return (
    <div class={styles.container}>
      {state.phase === "intro" && (
        <div class={styles.introSection}>
          <h1 class={styles.introTitle}>
            ET SI TOI, TU ÉTAIS MAIRE,&nbsp;TU FERAIS QUOI&nbsp;?
          </h1>
          <p class={styles.introText}>
            On te présente {QUESTIONS.length} questions sur des enjeux concrets pour
            Montpellier. Pour chaque question, choisis la proposition qui te correspond
            le mieux — sans savoir qui la défend. À la fin, découvre quel·le candidat·e
            est le plus proche de tes idées.
          </p>
          <button
            class={styles.startButton}
            onClick$={() => {
              state.phase = "playing";
            }}
          >
            Commencer →
          </button>
        </div>
      )}

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
            {(state.shuffledOptions ?? currentQuestion.options).map((option) => {
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
            })}
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
    </div>
  );
});

export const head: DocumentHead = {
  title: "Si tu étais maire… | Municipales Montpellier 2026",
  meta: [
    {
      name: "description",
      content:
        "Réponds à ces questions et découvre quel·le candidat·e aux municipales de Montpellier 2026 est le plus proche de tes idées.",
    },
  ],
};
