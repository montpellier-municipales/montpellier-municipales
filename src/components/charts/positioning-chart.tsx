import {
  component$,
  useVisibleTask$,
  useSignal,
  useComputed$,
} from "@builder.io/qwik";
import { Chart, registerables } from "chart.js";
import { inlineTranslate } from "qwik-speak";
import { vars } from "~/theme.css";

interface PositioningData {
  id: string;
  name: string;
  headOfList: string;
  logoUrl: string;
  positioning: {
    economy: number;
    societal: number;
    governance: number;
    security: number;
    ecology: number;
  };
}

interface PositioningChartProps {
  candidates: PositioningData[];
  xAxis: string;
  yAxis: string;
}

export const PositioningChart = component$<PositioningChartProps>(
  ({ candidates, xAxis, yAxis }) => {
    const chartCanvasRef = useSignal<HTMLCanvasElement>();
    const chartInstance = useSignal<Chart>();

    // Labels for dimensions
    const dimensionLabels = useComputed$(() => {
      const t = inlineTranslate();
      return {
        economy: t("comparator.positioning.dimensions.economy"),
        societal: t("comparator.positioning.dimensions.societal"),
        governance: t("comparator.positioning.dimensions.governance"),
        security: t("comparator.positioning.dimensions.security"),
        ecology: t("comparator.positioning.dimensions.ecology"),
      };
    });

    // Labels for values
    const valueLabels = useComputed$(() => {
      const t = inlineTranslate();
      const labels: Record<string, Record<number, string>> = {};
      const dims = ["economy", "societal", "governance", "security", "ecology"];
      
      dims.forEach(dim => {
        labels[dim] = {};
        const max = dim === "societal" ? 5 : 4;
        for (let i = 1; i <= max; i++) {
          labels[dim][i] = t(`comparator.positioning.labels.${dim}.${i}`);
        }
      });
      return labels;
    });

    const datasetLabel = useComputed$(() => {
      const t = inlineTranslate();
      return t("app.title");
    });

    // Prepare data for the chart
    const dataPoints = useComputed$(() => {
      return candidates.map((c) => ({
        x: c.positioning[xAxis as keyof typeof c.positioning],
        y: c.positioning[yAxis as keyof typeof c.positioning],
        label: c.name,
        headOfList: c.headOfList,
        logoUrl: c.logoUrl,
      }));
    });

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
      const data = track(() => dataPoints.value);
      const xDim = track(() => xAxis);
      const yDim = track(() => yAxis);
      const xLabels = track(() => valueLabels.value[xDim]);
      const yLabels = track(() => valueLabels.value[yDim]);
      const xTitle = track(() => dimensionLabels.value[xDim as keyof typeof dimensionLabels.value]);
      const yTitle = track(() => dimensionLabels.value[yDim as keyof typeof dimensionLabels.value]);
      const dsLabel = track(() => datasetLabel.value);

      if (!chartCanvasRef.value) return;

      Chart.register(...registerables);

      if (chartInstance.value) {
        chartInstance.value.destroy();
      }

      const ctx = chartCanvasRef.value.getContext("2d");
      if (!ctx) return;

      chartInstance.value = new Chart(ctx, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: dsLabel,
              data: data,
              backgroundColor: vars.color.primary,
              pointRadius: 8,
              pointHoverRadius: 12,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const p = context.raw;
                  const xVal = Math.round(p.x);
                  const yVal = Math.round(p.y);
                  return [
                    `${p.label} (${p.headOfList})`,
                    `${xTitle}: ${xLabels[xVal] || xVal}`,
                    `${yTitle}: ${yLabels[yVal] || yVal}`,
                  ];
                },
              },
            },
          },
          scales: {
            x: {
              min: 0.5,
              max: xDim === "societal" ? 5.5 : 4.5,
              ticks: {
                stepSize: 1,
                callback: (value: any) => xLabels[value] || value,
                font: { size: 10 },
              },
              title: {
                display: true,
                text: xTitle,
                font: { size: 14, weight: "bold" },
              },
            },
            y: {
              min: 0.5,
              max: yDim === "societal" ? 5.5 : 4.5,
              ticks: {
                stepSize: 1,
                callback: (value: any) => yLabels[value] || value,
                font: { size: 10 },
              },
              title: {
                display: true,
                text: yTitle,
                font: { size: 14, weight: "bold" },
              },
            },
          },
        },
      });
    });

    return (
      <div style={{ width: "100%", height: "500px", position: "relative" }}>
        <canvas ref={chartCanvasRef} />
      </div>
    );
  }
);
