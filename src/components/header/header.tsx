import { component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { LuMenu } from "@qwikest/icons/lucide";
import { getLocale, _ } from "compiled-i18n"; // Imports de compiled-i18n
//import { LanguageSwitcher } from "../language-switcher/language-switcher";
// import { ThemeToggle } from "../theme-toggle/theme-toggle";
import * as styles from "./header.css";
import { Container } from "../container/container";
import { Sidebar } from "../sidebar/sidebar";
import { Logo } from "../logo/logo";

export const Header = component$(() => {
  // const t = inlineTranslate(); // Remplacé par _
  const currentLocale = getLocale(); // Utilisation de getLocale de compiled-i18n
  // const config = useSpeakConfig(); // Non nécessaire avec compiled-i18n pour defaultLocale/locales si on les importe directement
  const loc = useLocation();

  // Helper pour générer les liens avec le préfixe de langue si besoin
  const getLink = (path: string) => {
    const defaultLang = "fr"; // La langue par défaut est 'fr' (définie dans vite.config.ts pour compiled-i18n)
    if (currentLocale === defaultLang) return path;
    return `/${currentLocale}${path}`;
  };

  const menu = [
    { label: _("app.menu.home"), href: "/" },
    { label: _("app.menu.comparator"), href: "/comparateur" },
    { label: _("app.menu.info"), href: "/info" }, // 'info' est la clé de trad pour '/info'
  ];

  return (
    <header class={styles.header}>
      <Container class={styles.container}>
        <Link href={getLink("/")} class={styles.logo}>
          <Logo />
        </Link>

        <nav class={styles.nav}>
          {menu.map((item) => (
            <Link
              key={item.href}
              href={getLink(item.href)}
              class={`${styles.link} ${loc.url.pathname.endsWith(item.href) ? styles.activeLink : ""}`} // Active state simple
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Sidebar menu={menu}>
          <LuMenu />
        </Sidebar>
      </Container>
    </header>
  );
});
