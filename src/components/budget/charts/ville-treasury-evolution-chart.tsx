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
import treasuryDataRaw from "~/content/data/ville_treasury.json";
import type { TreasuryLine } from "~/types/ville";

export const VilleTreasuryEvolutionChart = component$(() => {
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

    const data: Record<string, TreasuryLine[]> = treasuryDataRaw as any;
    const years = Object.keys(data).sort();

    const maxAuthData = years.map(year => (data[year] || []).reduce((sum, l) => sum + l.maxAuthorized, 0));
    const drawdownData = years.map(year => (data[year] || []).reduce((sum, l) => sum + l.drawdown, 0));
    const outstandingData = years.map(year => (data[year] || []).reduce((sum, l) => sum + l.outstanding, 0));

    const ctx = canvasRef.value.getContext("2d");
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: years,
        datasets: [
          {
            type: 'line',
            label: "Plafond d'autorisation (Lignes de crédit)",
            data: maxAuthData,
            borderColor: "#4a5568",
            backgroundColor: "#4a5568",
            borderDash: [5, 5],
            tension: 0.1,
            pointRadius: 5,
            order: 1
          },
          {
            type: 'bar',
            label: "Volume de Tirages (Utilisation cumulée)",
            data: drawdownData,
            backgroundColor: "rgba(49, 130, 206, 0.6)",
            borderColor: "#3182ce",
            borderWidth: 1,
            order: 2
          },
          {
            type: 'bar',
            label: "Encours de trésorerie au 31/12",
            data: outstandingData,
            backgroundColor: "rgba(229, 62, 62, 0.8)",
            borderColor: "#e53e3e",
            borderWidth: 1,
            order: 2
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: { 
                display: true, 
                text: "Recours à la Trésorerie de court terme", 
                font: { size: 16, weight: 'bold' } 
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return context.dataset.label + ": " + 
                        new Intl.NumberFormat("fr-FR", { 
                            style: "currency", 
                            currency: "EUR", 
                            maximumFractionDigits: 0 
                        }).format(context.parsed.y || 0);
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: "Montant (€)" },
                ticks: { 
                    callback: (value) => new Intl.NumberFormat("fr-FR", { 
                        notation: "compact", 
                        compactDisplay: "short" 
                    }).format(Number(value)) + " €" 
                }
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
