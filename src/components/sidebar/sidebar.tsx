import { $, component$, Slot, useSignal } from "@builder.io/qwik";
import { Modal } from "@qwik-ui/headless";
import {
  activeMenuListItem,
  menuList,
  menuListItem,
  modalPanelSheet,
  panelTitle,
  panelDescription,
} from "./sidebar.css";
import { toggleBaseStyle } from "../ToggleIcon/ToggleIcon.css";
import { Logo } from "../logo/logo";
import { Link, useLocation } from "@builder.io/qwik-city";
import { LanguageSwitcher } from "../language-switcher/language-switcher";
import { Spacer } from "../spacer";
import { inlineTranslate } from "qwik-speak";

type MenuItem = {
  label: string;
  href: string;
};

interface Props {
  menu: MenuItem[];
}

const cleanPath = (path: string) => {
  if (path.length <= 1) return path;
  if (path.endsWith("/")) return path.substring(0, path.length - 1);
  return path;
};

const cleanHref = (href: string) => {
  if (href.length > 3 && href[0] === "/" && href[3] === "/")
    return href.substring(3);
  return href;
};

export const Sidebar = component$<Props>(({ menu }) => {
  const loc = useLocation();
  const t = inlineTranslate();
  const currentLocale = loc.params.lang || "fr";

  const isOpen = useSignal(false);

  const getLink = (path: string) => {
    if (currentLocale === "fr") return path;
    return `/${currentLocale}${path}`;
  };
  const cleanedPath = cleanPath(loc.url.pathname);

  const closeSidebar = $(() => (isOpen.value = false));

  return (
    <>
      <Modal.Root bind:show={isOpen}>
        <Modal.Trigger
          class={toggleBaseStyle}
          name={t("sidebar.toggleSidebar")}
          aria-label={t("sidebar.toggleSidebar")}
          onClick$={() => (isOpen.value = true)}
        >
          <Slot />
        </Modal.Trigger>
        <Modal.Panel class={modalPanelSheet}>
          <Modal.Title class={panelTitle}>
            <Logo tag="div" />
          </Modal.Title>
          <Modal.Description align="center" class={panelDescription}>
            {t("sidebar.description")}
          </Modal.Description>

          <nav>
            <ul class={menuList}>
              {menu.map((item) => (
                <li key={item.href}>
                  <Link
                    href={getLink(item.href)}
                    onClick$={closeSidebar}
                    class={[
                      menuListItem,
                      ...(cleanedPath === cleanHref(item.href)
                        ? [activeMenuListItem]
                        : []),
                    ]}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Spacer />
          <LanguageSwitcher />
        </Modal.Panel>
      </Modal.Root>
    </>
  );
});
