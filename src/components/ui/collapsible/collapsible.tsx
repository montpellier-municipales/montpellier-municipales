import { component$, Slot, type Signal } from "@builder.io/qwik";
import { Collapsible } from "@qwik-ui/headless";
import * as styles from "./collapsible.css";
import { vars } from "~/theme.css";

interface CustomCollapsibleProps {
  label: string;
  bindOpen?: Signal<boolean>;
  open?: boolean;
}

export const CustomCollapsible = component$<CustomCollapsibleProps>(({ label, bindOpen, open }) => {
  return (
    <Collapsible.Root class={styles.root} bind:open={bindOpen} open={open}>
      <Collapsible.Trigger class={styles.trigger}>
        <span>{label}</span>
        <div class={styles.icon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={vars.color.textMuted}
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </Collapsible.Trigger>
      <Collapsible.Content class={styles.content}>
        <div class={styles.contentInner}>
          <Slot />
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
});
