import { component$, $ } from "@builder.io/qwik";
import { useTheme } from "~/routes/theme-context";
import * as styles from "./theme-toggle.css";

export const ThemeToggle = component$(() => {
  const { themeSig } = useTheme();

  const toggle = $(() => {
    themeSig.value = themeSig.value === "light" ? "dark" : "light";
    localStorage.setItem("theme", themeSig.value);
  });

  return (
    <button
      onClick$={toggle}
      class={styles.button}
      title="Changer de thème"
      aria-label="Changer de thème"
    >
      {themeSig.value === "light" ? "🌙" : "☀️"}
    </button>
  );
});
