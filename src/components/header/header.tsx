import { component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { LuMenu } from "@qwikest/icons/lucide";
import * as styles from "./header.css";
import { Container } from "../container/container";
import { Sidebar } from "../sidebar/sidebar";
import { Logo } from "../logo/logo";
import { inlineTranslate } from "qwik-speak";

export const Header = component$(() => {
  const loc = useLocation();
  const t = inlineTranslate();
  const currentLocale = loc.params.lang || "fr";

  const getLink = (path: string) => {
    const defaultLang = "fr";
    if (currentLocale === defaultLang) return path;
    return `/${currentLocale}${path}`;
  };

  const menu = [
    { label: t("app.menu.home"), href: "/" },
    //{ label: t("app.menu.comparator"), href: "/comparateur" },
    { label: t("app.menu.info"), href: "/info" },
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
