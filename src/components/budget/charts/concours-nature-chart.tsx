import { component$, useVisibleTask$, useSignal, type PropFunction } from "@builder.io/qwik";
import {
  Chart,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import type { ConcoursLine } from "~/types/budget";

interface ConcoursNatureChartProps {
  data: ConcoursLine[];
  onSelectNature$?: PropFunction<(nature: string) => void>;
}

const NATURE_LABELS: Record<string, string> = {
  "P1": "Privé (Associations...)",
  "P2": "Public (Coll., Étab...)",
  "P3": "Ménages",
  "P4": "Autres (Privé)",
  "U1": "Communes",
  "U2": "EPCI (Métropoles...)",
  "U3": "Départements",
  "U4": "Régions",
  "U5": "Établissements publics",
  "U6": "Autres (Public)",
};

const NATURE_COLORS: Record<string, string> = {
  "P1": "#3182CE", // Blue
  "P2": "#38A169", // Green
  "P3": "#E53E3E", // Red
  "P4": "#DD6B20", // Orange
  "U1": "#805AD5", // Purple
  "U2": "#319795", // Teal
  "U3": "#D69E2E", // Yellow
  "U4": "#ED64A6", // Pink
  "U5": "#718096", // Gray
  "U6": "#A0AEC0", // Light Gray
};

export const ConcoursNatureChart = component$<ConcoursNatureChartProps>(({ data, onSelectNature$ }) => {
  const canvasRef = useSignal<HTMLCanvasElement>();

  if (!data || data.length === 0) {
    return (
      <div style={{ 
        height: "300px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: "white",
        borderRadius: "0.5rem",
        border: "1px solid #e2e8f0",
        color: "#718096",
        marginBottom: "2rem"
      }}>
        Aucune donnée de subvention disponible pour cette année.
      </div>
    );
  }

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup, track }) => {
    track(() => data);

    Chart.register(
      PieController,
      ArcElement,
      Tooltip,
      Legend
    );

    if (!canvasRef.value) return;

    // 1. Group data by nature and sum amounts
    const distribution: Record<string, number> = {};
    data.forEach(item => {
      const nature = item.nature_beneficiaire || "unknown";
      distribution[nature] = (distribution[nature] || 0) + item.montant;
    });

    // 2. Sort natures to have consistent order
    const sortedNatures = Object.keys(distribution).sort((a, b) => distribution[b] - distribution[a]);

    const labels = sortedNatures.map(n => NATURE_LABELS[n] || n);
    const chartData = sortedNatures.map(n => distribution[n]);
    const backgroundColors = sortedNatures.map(n => NATURE_COLORS[n] || "#CBD5E0");

    const ctx = canvasRef.value.getContext("2d");
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [{
          data: chartData,
          backgroundColor: backgroundColors,
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event, elements) => {
          if (elements.length > 0 && onSelectNature$) {
            const index = elements[0].index;
            const natureCode = sortedNatures[index];
            onSelectNature$(natureCode);
          }
        },
        plugins: {
          legend: {
            position: "right",
            labels: {
              usePointStyle: true,
              boxWidth: 10,
              padding: 15,
              font: {
                size: 13,
                weight: 500
              }
            }
          },
          title: {
            display: true,
            text: "Distribution par Nature de Bénéficiaire",
            padding: { bottom: 20 },
            font: {
              size: 18,
              weight: "bold",
            },
          },
          tooltip: {
            bodyFont: {
              size: 14
            },
            titleFont: {
              size: 14
            },
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce((a: number, b: any) => a + (b as number), 0);
                const value = context.parsed as number;
                const percentage = ((value / total) * 100).toFixed(1);
                
                return (
                  context.label +
                  ": " +
                  new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                  }).format(value) +
                  ` (${percentage}%)`
                );
              },
            },
          },
        },
      },
    });

    cleanup(() => {
      chart.destroy();
    });
  });

  return (
    <div
      style={{
        height: "350px",
        width: "100%",
        marginBottom: "2rem",
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "0.5rem",
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        border: "1px solid #e2e8f0",
        cursor: onSelectNature$ ? "pointer" : "default"
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
});