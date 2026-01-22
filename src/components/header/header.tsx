import { component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { LuMenu, LuChevronDown } from "@qwikest/icons/lucide";
import { Popover } from "@qwik-ui/headless";
import * as styles from "./header.css";
import { Container } from "../container/container";
import { Sidebar } from "../sidebar/sidebar";
import { Logo } from "../logo/logo";
import { inlineTranslate } from "qwik-speak";
import { getIsPathActive } from "~/utils";

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
    { label: t("app.menu.inscriptionElectorale"), href: "/inscription" },
    { label: t("app.menu.roleMairieMetropole"), href: "/role-mairie-metropole" },
    { 
      label: t("app.menu.budget"), 
      subItems: [
        { label: t("app.menu.budgetVille"), href: "/budget/montpellier/" },
        { label: t("app.menu.budgetMetropole"), href: "/budget/montpellier-metropole/" },
      ] 
    },
    { label: t("app.menu.info"), href: "/info" },
  ];

  const isPathActive = getIsPathActive(loc);

  return (
    <header class={styles.header}>
      <Container class={styles.container}>
        <Link href={getLink("/")} class={styles.logo}>
          <Logo />
        </Link>

        <nav class={styles.nav}>
          {menu.map((item) => {
            if (item.subItems) {
              const isActive = item.subItems.some(sub => isPathActive(sub.href));
              return (
                <Popover.Root key={item.label}>
                  <Popover.Trigger class={`${styles.budgetTrigger} ${isActive ? styles.activeLink : ""}`}>
                    {item.label}
                    <LuChevronDown height={16} />
                  </Popover.Trigger>
                  <Popover.Panel class={styles.popover}>
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.href}
                        href={getLink(sub.href)}
                        class={`${styles.popoverLink} ${isPathActive(sub.href) ? styles.activeLink : ""}`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </Popover.Panel>
                </Popover.Root>
              );
            }
            return (
              <Link
                key={item.href}
                href={getLink(item.href!)}
                class={`${styles.link} ${isPathActive(item.href!) ? styles.activeLink : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Sidebar menu={menu}>
          <LuMenu />
        </Sidebar>
      </Container>
    </header>
  );
});