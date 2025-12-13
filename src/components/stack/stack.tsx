import { component$, Slot } from "@builder.io/qwik";
import { stack } from "./stack.css";

export const Stack = component$(() => {
  return (
    <div class={stack}>
      <Slot />
    </div>
  );
});
