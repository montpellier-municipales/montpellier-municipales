import { component$, Slot, useSignal } from "@builder.io/qwik";
import { Toggle } from "@qwik-ui/headless";
import { toggleBaseStyle } from "./ToggleIcon.css";

export const IconButton = component$(() => {
  const pressedState = useSignal(true);
  return (
    <Toggle bind:pressed={pressedState} class={toggleBaseStyle}>
      <Slot />
    </Toggle>
  );
});
