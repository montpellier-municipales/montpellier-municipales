import {
  component$,
  type PropFunction,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import { Select } from "@qwik-ui/headless";
import { LuCheck, LuChevronDown } from "@qwikest/icons/lucide";
import * as styles from "./dropdown.css";

interface DropdownProps {
  options: { value: string; label: string; description?: string }[];
  value: string;
  onChange$: PropFunction<(value: string) => void>;
  placeholder?: string;
  label?: string; // Optional label for the group
}

export const Dropdown = component$<DropdownProps>(
  ({ options, value, onChange$, placeholder = "Sélectionner...", label }) => {
    const selectedValue = useSignal(value);

    useTask$(({ track }) => {
      track(() => value);
      selectedValue.value = value;
    });

    return (
      <Select.Root
        bind:value={selectedValue}
        onChange$={onChange$}
        class={
          {
            // On peut passer des classes au root si besoin, mais ici on style les sous-composants
          }
        }
      >
        {label && <Select.Label class={styles.label}>{label}</Select.Label>}
        <Select.Trigger class={styles.trigger}>
          <Select.DisplayValue
            placeholder={placeholder}
            class={styles.displayValue}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
              flexGrow: 0,
            }}
          >
            <LuChevronDown />
          </div>
        </Select.Trigger>
        <Select.Popover class={styles.popover}>
          {options.map((opt) => (
            <Select.Item key={opt.value} value={opt.value} class={styles.item}>
              <div class={styles.itemContent}>
                <Select.ItemLabel>{opt.label}</Select.ItemLabel>
                {opt.description && (
                  <span class={styles.description}>{opt.description}</span>
                )}
              </div>
              <Select.ItemIndicator>
                <LuCheck />
              </Select.ItemIndicator>
            </Select.Item>
          ))}
        </Select.Popover>
      </Select.Root>
    );
  }
);
