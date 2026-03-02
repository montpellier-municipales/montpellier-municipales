import { component$, JSXOutput, QRL } from "@builder.io/qwik";
import {
  axis as axisClass,
  axisColumn,
  axisGradient,
  axisItems,
  axisTick,
  tickLink,
  plot,
} from "./OrdinalAxisPlot.css";

export type OrdinalValue = string | number;

export interface AxisItem {
  id: string;
  value: OrdinalValue;
  render$: QRL<() => JSXOutput>;
}

interface OrdinalAxisPlotProps {
  /** Ordered axis values (e.g. [1,2,3,4,5] or ["Neoliberalism", "Socialism"]) */
  axis: OrdinalValue[];

  /** Items to place on the axis */
  items: AxisItem[];

  /** Optional map from value label → href to make tick labels into links */
  tickLinks?: Record<string, string>;
}

export const OrdinalAxisPlot = component$<OrdinalAxisPlotProps>(
  ({ axis, items, tickLinks }) => {
    const itemsByValue = [...axis].reverse().map((value) => ({
      value,
      items: items.filter((item) => item.value === value),
    }));

    return (
      <div class={plot}>
        <div class={axisClass}>
          {itemsByValue.map(({ value }) => (
            <div class={axisColumn} key={String(value)}>
              <div class={axisTick}>
                {tickLinks?.[String(value)] ? (
                  <a href={tickLinks[String(value)]} class={tickLink}>
                    {value}
                  </a>
                ) : (
                  value
                )}
              </div>
            </div>
          ))}
        </div>
        <i class={axisGradient} />
        <div class={axisClass}>
          {itemsByValue.map(({ value, items }) => (
            <div class={axisColumn} key={String(value)}>
              <div class={axisItems}>{items.map((item) => item.render$())}</div>
            </div>
          ))}
        </div>
      </div>
    );
  },
);
