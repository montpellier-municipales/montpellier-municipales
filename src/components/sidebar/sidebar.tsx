import { $, component$, Slot, useSignal } from "@builder.io/qwik";
import { Modal, Collapsible } from "@qwik-ui/headless";
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
import { getIsPathActive } from "~/utils";
import { LuChevronDown } from "@qwikest/icons/lucide";

type MenuItem = {
  label: string;
  href?: string;
  subItems?: { label: string; href: string }[];
};

interface Props {
  menu: MenuItem[];
}

export const Sidebar = component$<Props>(({ menu }) => {
  const loc = useLocation();
  const t = inlineTranslate();
  const currentLocale = loc.params.lang || "fr";

  const isOpen = useSignal(false);

  const getLink = (path: string) => {
    if (currentLocale === "fr") return path;
    return `/${currentLocale}${path}`;
  };
  const isPathActive = getIsPathActive(loc);

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
              {menu.map((item) => {
                if (item.subItems) {
                  const isActive = item.subItems.some(sub => isPathActive(sub.href));
                  return (
                    <li key={item.label}>
                      <Collapsible.Root>
                        <Collapsible.Trigger 
                          class={[
                            menuListItem,
                            { [activeMenuListItem]: isActive },
                          ]}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
                        >
                          {item.label}
                          <LuChevronDown height={16} />
                        </Collapsible.Trigger>
                        <Collapsible.Content>
                          <ul style={{ paddingLeft: '1rem', listStyle: 'none' }}>
                            {item.subItems.map((sub) => (
                              <li key={sub.href}>
                                <Link
                                  href={getLink(sub.href)}
                                  onClick$={closeSidebar}
                                  class={[
                                    menuListItem,
                                    ...(isPathActive(sub.href) ? [activeMenuListItem] : []),
                                  ]}
                                  style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                                >
                                  {sub.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </Collapsible.Content>
                      </Collapsible.Root>
                    </li>
                  );
                }
                return (
                  <li key={item.href}>
                    <Link
                      href={getLink(item.href!)}
                      onClick$={closeSidebar}
                      class={[
                        menuListItem,
                        ...(isPathActive(item.href!) ? [activeMenuListItem] : []),
                      ]}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <Spacer />
          <LanguageSwitcher />
        </Modal.Panel>
      </Modal.Root>
    </>
  );
});