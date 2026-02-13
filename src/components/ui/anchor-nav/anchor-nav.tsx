import {
  component$,
  useSignal,
  useVisibleTask$,
  $,
} from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";
import { Tabs } from "@qwik-ui/headless";
import * as styles from "./anchor-nav.css";

interface Anchor {
  id: string;
  label: string;
}

interface AnchorNavProps {
  anchors: Anchor[];
}

export const AnchorNav = component$<AnchorNavProps>(({ anchors }) => {
  const selectedIndex = useSignal<number>(0);
  const isAutoScrolling = useSignal(false);

  const scrollTo = $((id: string) => {
    if (isServer) return;

    const element = document.getElementById(id);
    if (element) {
      isAutoScrolling.value = true;
      const offset = 150;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Reset auto-scrolling flag after animation
      setTimeout(() => {
        isAutoScrolling.value = false;
      }, 1000);
    }
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Don't update active tab if we are currently auto-scrolling to a section
        if (isAutoScrolling.value) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = anchors.findIndex((a) => a.id === entry.target.id);
            if (index !== -1 && index !== selectedIndex.value) {
              selectedIndex.value = index;
            }
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0,
      }
    );

    anchors.forEach((anchor) => {
      const element = document.getElementById(anchor.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  });

  return (
    <Tabs.Root
      class={styles.nav}
      bind:selectedIndex={selectedIndex}
      onSelectedIndexChange$={(index) => {
        if (!isServer && !isAutoScrolling.value) {
          scrollTo(anchors[index].id);
        }
      }}
    >
      <Tabs.List class={styles.tabList}>
        {anchors.map((anchor) => (
          <Tabs.Tab key={anchor.id} class={styles.tab}>
            {anchor.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {/* We provide empty panels to satisfy the headless component requirements, 
          even though we use standard scroll navigation. */}
      {anchors.map((anchor) => (
        <Tabs.Panel key={anchor.id} />
      ))}
    </Tabs.Root>
  );
});