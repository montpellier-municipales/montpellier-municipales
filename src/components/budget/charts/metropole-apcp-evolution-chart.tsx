import { component$, useVisibleTask$, useSignal } from "@builder.io/qwik";
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import apcpDataRaw from "~/content/data/metropole_apcp_evolution.json";

export const MetropoleApcpEvolutionChart = component$(() => {
  const canvasRef = useSignal<HTMLCanvasElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    Chart.register(
      BarController,
      BarElement,
      LinearScale,
      CategoryScale,
      Title,
      Tooltip,
      Legend
    );

    if (!canvasRef.value) return;

    const data: Record<string, any> = apcpDataRaw as any;
    const years = Object.keys(data).sort();

    const realised = years.map(year => data[year].realised);
    const voted = years.map(year => data[year].voted);

    const ctx = canvasRef.value.getContext("2d");
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: years,
        datasets: [
          {
            label: "Crédits de Paiement Réalisés",
            data: realised,
            backgroundColor: "#38a169",
            stack: 'cp',
          },
          {
            label: "Crédits de Paiement Votés (BP)",
            data: voted,
            backgroundColor: "#9ae6b4",
            stack: 'cp',
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
            title: { display: true, text: "Évolution des Investissements (Métropole)", font: { size: 16 } },
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
                beginAtZero: true,
                title: { display: true, text: "Montant (€)" },
                ticks: { callback: (val) => new Intl.NumberFormat("fr-FR", { notation: "compact" }).format(Number(val)) + " €" },
                stacked: true,
            },
            x: {
                stacked: true,
            }
        }
      },
    });

    cleanup(() => chart.destroy());
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
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        border: "1px solid #e2e8f0",
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
});