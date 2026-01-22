import { component$, useVisibleTask$, useSignal } from "@builder.io/qwik";
import {
  Chart,
  LineController,
  BarController,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import debtDataRaw from "~/content/data/metropole_debt_evolution.json";

export const MetropoleDebtEvolutionChart = component$(() => {
  const canvasRef = useSignal<HTMLCanvasElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    Chart.register(
      LineController,
      BarController,
      LineElement,
      BarElement,
      PointElement,
      LinearScale,
      CategoryScale,
      Title,
      Tooltip,
      Legend
    );

    if (!canvasRef.value) return;

    const data: Record<string, any> = debtDataRaw as any;
    // Filter out 2025 as it only contains partial BS data
    const years = Object.keys(data).filter(y => y !== "2025").sort();

    const outstanding = years.map(year => data[year].outstanding);
    const newDebtBudgeted = years.map(year => data[year].newDebtBudgeted || 0);
    const annuity = years.map(year => data[year].annuity);

    const ctx = canvasRef.value.getContext("2d");
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: years,
        datasets: [
          {
            type: 'line',
            label: "Annuité (Remboursement)",
            data: annuity,
            borderColor: "#e53e3e",
            backgroundColor: "#e53e3e",
            yAxisID: 'y1',
            tension: 0.3,
            pointRadius: 4,
            order: 0, // Lower order is drawn on top
          },
          {
            type: 'bar',
            label: "Encours (Contrats existants)",
            data: outstanding,
            backgroundColor: "#2b6cb0",
            stack: 'stock',
            yAxisID: 'y',
            order: 1,
          },
          {
            type: 'bar',
            label: "Emprunt Nouveau (Budgeté)",
            data: newDebtBudgeted,
            backgroundColor: "#90cdf4",
            stack: 'stock',
            yAxisID: 'y',
            order: 1,
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            title: { display: true, text: "Évolution de la Dette de la Métropole : Encours et Annuité", font: { size: 16 } },
            legend: { position: 'bottom' },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const val = context.parsed.y || 0;
                        return context.dataset.label + ": " + 
                        new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(val);
                    }
                }
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                beginAtZero: true,
                title: { display: true, text: "Encours (€)" },
                ticks: { callback: (val) => new Intl.NumberFormat("fr-FR", { notation: "compact" }).format(Number(val)) + " €" },
                stacked: true
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                beginAtZero: true,
                grid: { drawOnChartArea: false },
                title: { display: true, text: "Annuité (€)" },
                ticks: { callback: (val) => new Intl.NumberFormat("fr-FR", { notation: "compact" }).format(Number(val)) + " €" }
            },
            x: {
                stacked: true
            }
        }
      },
    });

    cleanup(() => chart.destroy());
  });

  return (
    <div
      style={{
        height: "450px",
        width: "100%",
        marginBottom: "2rem",
        backgroundColor: "white",
        padding: "1rem",
        borderRadius: "0.5rem",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        border: "1px solid #e2e8f0",
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
});
