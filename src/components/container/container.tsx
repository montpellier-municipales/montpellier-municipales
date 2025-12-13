import { component$, Slot } from "@builder.io/qwik";
import { container } from "./container.css";

interface Props {
  class?: string | string[];
}

export const Container = component$<Props>(({ class: classname }) => {
  return (
    <div
      class={[
        container,
        ...(Array.isArray(classname)
          ? classname
          : classname
            ? [classname]
            : []),
      ]}
    >
      <Slot />
    </div>
  );
});
