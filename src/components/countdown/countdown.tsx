import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { inlineTranslate, useSpeakContext } from "qwik-speak";
import { config } from "~/speak-config";
import * as styles from "./countdown.css";

export const Countdown = component$(() => {
  const t = inlineTranslate();
  const ctx = useSpeakContext();
  const lang = ctx.locale.lang;

  const inscriptionLink =
    lang === config.defaultLocale.lang
      ? "/comparateur"
      : `/${lang}/comparateur`;

  const timeLeft = useStore({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Date cible : Dimanche 15 Mars 2026 à 08h00 (Heure de Paris/Locale)
  const targetDate = new Date("2026-03-15T08:00:00").getTime();

  // Calcul du temps restant uniquement côté client pour éviter les écarts d'hydratation
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        timeLeft.days = Math.floor(difference / (1000 * 60 * 60 * 24));
        timeLeft.hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        timeLeft.minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        timeLeft.seconds = Math.floor((difference % (1000 * 60)) / 1000);
      } else {
        // Temps écoulé
        timeLeft.days = 0;
        timeLeft.hours = 0;
        timeLeft.minutes = 0;
        timeLeft.seconds = 0;
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 100);
    cleanup(() => clearInterval(timer));
  });

  return (
    <div class={styles.container}>
      <div class={styles.title}>{t("home.countdown.title")}</div>

      <div class={styles.timerGrid}>
        <div class={styles.timeUnit}>
          <span class={styles.number}>{timeLeft.days}</span>
          <span class={styles.label}>
            {timeLeft.days <= 1
              ? t("home.countdown.day")
              : t("home.countdown.days")}
          </span>
        </div>
        <div class={styles.timeUnit}>
          <span class={styles.number}>
            {timeLeft.hours.toString().padStart(2, "0")}:
            {timeLeft.minutes.toString().padStart(2, "0")}:
            {timeLeft.seconds.toString().padStart(2, "0")}
          </span>
          <span class={styles.label}>
             {t("home.countdown.hours")}
          </span>
        </div>
      </div>

      <p class={styles.message}>{t("home.countdown.euMessage")}</p>

      <Link href={inscriptionLink} class={styles.link}>
        {t("home.countdown.action")}
      </Link>
    </div>
  );
});
