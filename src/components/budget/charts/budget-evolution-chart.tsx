import { component$, useVisibleTask$, useSignal } from "@builder.io/qwik";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import functionalData from "~/content/data/budget_evolution_functional.json";

// Register Chart.js components
// Note: We register inside useVisibleTask to ensure browser context, but importing them here is fine.

const FUNCTION_COLORS: Record<string, string> = {
  "0": "#A0AEC0", // Services généraux (Gray)
  "1": "#3182CE", // Sécurité (Blue)
  "2": "#63B3ED", // Enseignement (Light Blue)
  "3": "#9F7AEA", // Culture/Sport (Purple)
  "4": "#ED64A6", // Santé/Social (Pink)
  "5": "#E53E3E", // Aménagement (Red)
  "6": "#DD6B20", // Action éco (Orange)
  "7": "#38A169", // Environnement (Green)
  "8": "#319795", // Transports (Teal)
  "9": "#718096", // Divers (Dark Gray)
  "NC": "#CBD5E0",
};

export const BudgetEvolutionChart = component$(() => {
  const canvasRef = useSignal<HTMLCanvasElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    Chart.register(
      LineController,
      LineElement,
      PointElement,
      LinearScale,
      CategoryScale,
      Title,
      Tooltip,
      Legend,
      Filler
    );

    if (!canvasRef.value) return;

    // 1. Extract Years and Unique Functions
    const years = Array.from(new Set(functionalData.map((d) => d.year))).sort(
      (a, b) => a - b
    );
    
    // Sort functions by code to have consistent stacking order
    const functions = Array.from(
      new Set(functionalData.map((d) => d.fonction_code))
    ).sort();

    // 2. Build Datasets
    const datasets = functions.map((code) => {
      const label = functionalData.find(d => d.fonction_code === code)?.fonction_label || code;
      const color = FUNCTION_COLORS[code] || "#CBD5E0";

      const data = years.map((year) => {
        const item = functionalData.find(
          (d) => d.year === year && d.fonction_code === code
        );
        return item ? item.montant_realise : 0;
      });

      return {
        label: label,
        data: data,
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
      };
    });

    const ctx = canvasRef.value.getContext("2d");
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: years.map(String),
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              boxWidth: 8,
            }
          },
          title: {
            display: true,
            text: "Dépenses par Fonction (Budget Principal)",
            font: {
              size: 16,
              weight: "bold",
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return (
                  context.dataset.label +
                  ": " +
                  new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                  }).format(context.parsed.y!)
                );
              },
            },
            padding: 10,
            cornerRadius: 4,
            itemSort: (a, b) => (b.parsed.y || 0) - (a.parsed.y || 0),
          },
        },
        scales: {
          y: {
            stacked: true,
            beginAtZero: true,
            grid: {
              color: "#e2e8f0",
            },
            ticks: {
              callback: (value) => {
                if (typeof value === "number") {
                  return (
                    new Intl.NumberFormat("fr-FR", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(value) + " €"
                  );
                }
                return value;
              },
            },
          },
          x: {
            grid: {
              display: false,
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
        height: "400px",
        width: "100%",
        marginBottom: "2rem",
        backgroundColor: "white",
        padding: "1rem",
        borderRadius: "0.5rem",
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        border: "1px solid #e2e8f0",
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
});
