import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";
import * as styles from "./footer.css";
import { Logo } from "~/components/logo/logo";

export const Footer = component$(() => {
  const t = inlineTranslate();

  return (
    <footer class={styles.footer}>
      <div class={styles.container}>
        {/* Colonne Marque */}
        <div class={styles.brandColumn}>
          <div class={styles.logo}>
            <Logo />
          </div>
          <p class={styles.tagline}>{t("app.subtitle")}</p>
        </div>

        {/* Colonne Liens */}
        <div class={styles.linksColumn}>
          <Link href="/contact" class={styles.link}>
            {t("footer.contact")}
          </Link>
          <Link href="/qui-sommes-nous" class={styles.link}>
            {t("footer.whoAreWe")}
          </Link>
          <Link href="/mentions-legales" class={styles.link}>
            {t("footer.legalNotices")}
          </Link>
          <Link href="/politique-confidentialite" class={styles.link}>
            {t("footer.privacyPolicy")}
          </Link>
        </div>

        {/* Colonne Social */}
        {/*<div class={styles.socialColumn}>
          <a
            href="https://instagram.com/montpelliermunicipales2026"
            target="_blank"
            rel="noopener noreferrer"
            class={styles.socialLink}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span>{t("footer.followUs")}</span>
          </a>
        </div>*/}
      </div>

      <div class={styles.copyright}>
        <a
          href="https://creativecommons.org/licenses/by-sa/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          class={styles.link}
        >
          {t("footer.copyright")}
        </a>
      </div>
    </footer>
  );
});
