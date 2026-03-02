import { component$, $, type JSXOutput } from "@builder.io/qwik";
import { Tooltip } from "@qwik-ui/headless";
import { OrdinalAxisPlot } from "~/components/OrdinalAxisPlot/OrdinalAxisPlot";
import * as styles from "./comparator.css";

const dimensions = [
  { id: "economy", max: 4 },
  { id: "societal", max: 5 },
  { id: "governance", max: 4 },
  { id: "security", max: 4 },
  { id: "ecology", max: 4 },
] as const;

type PositioningTranslations = {
  sectionTitle: string;
  sectionDesc: string;
  dimensions: Record<string, string>;
  labels: Record<string, Record<string, string>>;
};

type SelectedList = {
  id: string;
  name: string;
  headOfList: string;
  candidatePictureUrl: string;
  positioning: {
    economy: number;
    societal: number;
    governance: number;
    security: number;
    ecology: number;
  };
};

interface PositioningSectionProps {
  selectedLists: SelectedList[];
  positioningTranslations: PositioningTranslations;
}

export const PositioningSection = component$<PositioningSectionProps>(
  ({ selectedLists, positioningTranslations: pt }) => {
    return (
      <section class={styles.sectionCard}>
        <h2 class={styles.sectionTitle}>{pt.sectionTitle}</h2>
        <p class={styles.sectionDesc}>{pt.sectionDesc}</p>
        <div class={styles.axesStack}>
          {dimensions.map((dim) => {
            const items = selectedLists.map((c) => ({
              id: c.id,
              value:
                pt.labels[dim.id]?.[
                  String(c.positioning[dim.id as keyof typeof c.positioning])
                ] ?? "",
              render$: $(
                (): JSXOutput => (
                  <Tooltip.Root gutter={4} flip>
                    <Tooltip.Trigger class={styles.candidateLogoTrigger}>
                      <img
                        src={c.candidatePictureUrl}
                        alt={c.name}
                        class={styles.plotCandidateLogo}
                        width={48}
                        height={48}
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Panel
                      class={styles.candidateTooltip}
                      aria-label="Tooltip content"
                    >
                      {c.name} · {c.headOfList}
                    </Tooltip.Panel>
                  </Tooltip.Root>
                ),
              ),
            }));

            return (
              <div key={dim.id} class={styles.dimensionGroup}>
                <h3 class={styles.dimensionTitle}>
                  {pt.dimensions[dim.id] ?? dim.id}
                </h3>
                <div class={styles.axisWrapper}>
                  <OrdinalAxisPlot
                    axis={Array.from({ length: dim.max }).map(
                      (_, i) => pt.labels[dim.id]?.[String(i + 1)] ?? "",
                    )}
                    items={items}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  },
);
