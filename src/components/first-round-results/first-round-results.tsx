import { component$, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { inlineTranslate, useSpeakContext } from "qwik-speak";
import { config } from "~/speak-config";
import * as styles from "./first-round-results.css";

const PARTICIPANTS = 88232;
const REGISTERED_VOTERS = Math.round(PARTICIPANTS / 0.5043); // ~174 973
const EXPRESSED_VOTES = 87003;
const BLANK_NULL_VOTES = PARTICIPANTS - EXPRESSED_VOTES; // 1229
const ABSTENTION_VOTES = REGISTERED_VOTERS - PARTICIPANTS; // ~86 741

const CANDIDATES = [
  {
    name: "Michaël Delafosse",
    list: "DEMAIN MONTPELLIER",
    voix: 29069,
    qualified: true,
    listId: "michael-delafosse",
  },
  {
    name: "Nathalie Oziol",
    list: "FAIRE MIEUX POUR MONTPELLIER",
    voix: 13366,
    qualified: true,
    listId: "la-france-insoumise",
  },
  {
    name: "Mohed Altrad",
    list: "MONTPELLIER NOTRE FIERTÉ",
    voix: 9837,
    qualified: true,
    listId: "mohed-altrad",
  },
  {
    name: "Philippe Saurel",
    list: "Montpellier Citoyenne",
    voix: 7712,
    qualified: false,
    listId: "philippe-saurel",
  },
  {
    name: "Rémi Gaillard",
    list: "YES WE CLOWN",
    voix: 7145,
    qualified: false,
    listId: "remi-gaillard",
  },
  {
    name: "Isabelle Perrein",
    list: "AIMER MONTPELLIER",
    voix: 6524,
    qualified: false,
    listId: "aimer-montpellier",
  },
  {
    name: "France Jamet",
    list: "LIBÉRER MONTPELLIER !",
    voix: 6320,
    qualified: false,
  },
  {
    name: "Jean-Louis Roumégas",
    list: "LE PRINTEMPS MONTPELLIERAIN",
    voix: 4105,
    qualified: false,
    listId: "les-ecologistes",
  },
  {
    name: "Max Muller",
    list: "RÉVOLUTION PERMANENTE",
    voix: 1220,
    qualified: false,
    listId: "revolution-permanente",
  },
  {
    name: "Thierry Tsagalos",
    list: "UNION MONTPELLIERAINE",
    voix: 969,
    qualified: false,
  },
  {
    name: "Morgane Lachiver",
    list: "LUTTE OUVRIÈRE",
    voix: 426,
    qualified: false,
    listId: "lutte-ouvriere",
  },
  {
    name: "Kadija Zbairi",
    list: "LA MUNICIPALISTE",
    voix: 177,
    qualified: false,
    listId: "la-municipaliste-kadija-zbairi",
  },
  {
    name: "Sylvie Trousselier",
    list: "Parti des travailleurs",
    voix: 133,
    qualified: false,
  },
];

function formatPct(value: number, total: number): string {
  return ((value / total) * 100).toFixed(1) + "%";
}

function formatVoix(voix: number): string {
  return voix.toLocaleString("fr-FR");
}

export const FirstRoundResults = component$(() => {
  const t = inlineTranslate();
  const ctx = useSpeakContext();
  const lang = ctx.locale.lang;
  const withAbstention = useSignal(true);

  const getLocalizedLink = (path: string) =>
    lang === config.defaultLocale.lang ? path : `/${lang}${path}`;

  const total = withAbstention.value ? REGISTERED_VOTERS : EXPRESSED_VOTES;

  return (
    <div class={styles.container}>
      <div class={styles.header}>
        <h2 class={styles.title}>{t("home.firstRound.title")}</h2>
        <div class={styles.toggleGroup}>
          <button
            class={[
              styles.toggleButton,
              withAbstention.value ? styles.toggleButtonActive : "",
            ].join(" ")}
            onClick$={() => (withAbstention.value = true)}
          >
            {t("home.firstRound.withAbstention")}
          </button>
          <button
            class={[
              styles.toggleButton,
              !withAbstention.value ? styles.toggleButtonActive : "",
            ].join(" ")}
            onClick$={() => (withAbstention.value = false)}
          >
            {t("home.firstRound.withoutAbstention")}
          </button>
        </div>
      </div>

      {withAbstention.value && (
        <>
          <div class={styles.barRow}>
            <div class={styles.barLabel}>
              <div class={styles.barLabelName}>
                {t("home.firstRound.abstention")}
              </div>
            </div>
            <div class={styles.barTrack}>
              <div
                class={[styles.barFill, styles.barFillAbstention].join(" ")}
                style={{
                  width: formatPct(ABSTENTION_VOTES, REGISTERED_VOTERS),
                }}
              />
            </div>
            <div class={styles.barValue}>
              {formatPct(ABSTENTION_VOTES, REGISTERED_VOTERS)}
            </div>
            <div class={styles.barVoix}>{formatVoix(ABSTENTION_VOTES)}</div>
          </div>
          <div class={styles.separator} />
        </>
      )}

      {CANDIDATES.map((candidate) => (
        <div key={candidate.name} class={styles.barRow}>
          <div class={styles.barLabel}>
            <div class={styles.barLabelName}>
              {candidate.listId ? (
                <Link href={getLocalizedLink(`/listes/${candidate.listId}`)}>
                  {candidate.name}
                </Link>
              ) : (
                candidate.name
              )}
              {candidate.qualified && (
                <span class={styles.qualifiedBadge}>
                  ✓ {t("home.firstRound.qualified")}
                </span>
              )}
            </div>
            <div class={styles.barLabelList}>{candidate.list}</div>
          </div>
          <div class={styles.barTrack}>
            <div
              class={[
                styles.barFill,
                candidate.qualified ? styles.barFillQualified : "",
              ].join(" ")}
              style={{ width: formatPct(candidate.voix, total) }}
            />
          </div>
          <div class={styles.barValue}>
            {formatPct(candidate.voix, total)}
          </div>
          <div class={styles.barVoix}>{formatVoix(candidate.voix)}</div>
        </div>
      ))}

      {withAbstention.value && (
        <>
          <div class={styles.separator} />
          <div class={styles.barRow}>
            <div class={styles.barLabel}>
              <div class={styles.barLabelName}>
                {t("home.firstRound.blancNul")}
              </div>
            </div>
            <div class={styles.barTrack}>
              <div
                class={[styles.barFill, styles.barFillBlank].join(" ")}
                style={{
                  width: formatPct(BLANK_NULL_VOTES, REGISTERED_VOTERS),
                }}
              />
            </div>
            <div class={styles.barValue}>
              {formatPct(BLANK_NULL_VOTES, REGISTERED_VOTERS)}
            </div>
            <div class={styles.barVoix}>{formatVoix(BLANK_NULL_VOTES)}</div>
          </div>
        </>
      )}

      <p class={styles.note}>{t("home.firstRound.note")}</p>
    </div>
  );
});
