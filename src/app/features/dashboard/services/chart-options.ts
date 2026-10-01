import { ChartOptions, TooltipItem } from 'chart.js';
import { formatCurrency } from '@shared/utils/currency.utils';
import { CHART_COLORS } from './chart-theme';

/*
 * Opções estáticas de cada gráfico. Não dependem dos dados, então são
 * constantes simples, e não `computed()`.
 */

function sumDataset(item: TooltipItem<'doughnut'>): number {
  return item.dataset.data.reduce((sum, value) => sum + value, 0);
}

export const DOUGHNUT_OPTIONS: ChartOptions<'doughnut'> = {
  cutout: '62%',
  plugins: {
    legend: {
      position: 'right',
      labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 8, padding: 14 },
    },
    tooltip: {
      callbacks: {
        label: (item) => {
          const total = sumDataset(item);
          const percent = total === 0 ? 0 : (item.parsed / total) * 100;
          return ` ${formatCurrency(item.parsed)} (${percent.toFixed(1).replace('.', ',')}%)`;
        },
      },
    },
  },
};

export const BAR_OPTIONS: ChartOptions<'bar'> = {
  // Barras horizontais: os nomes das categorias ficam legíveis no eixo Y.
  indexAxis: 'y',
  plugins: {
    // Série única: o título do card e os rótulos do eixo já identificam tudo.
    legend: { display: false },
    tooltip: {
      callbacks: { label: (item) => ` ${formatCurrency(item.parsed.x ?? 0)}` },
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: { color: CHART_COLORS.grid },
      border: { display: false },
      ticks: { callback: (value) => formatCurrency(Number(value)) },
    },
    y: {
      grid: { display: false },
    },
  },
};

export const LINE_OPTIONS: ChartOptions<'line'> = {
  // Tooltip ao passar o mouse em qualquer ponto da coluna do mês, não só no marcador.
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: { label: (item) => ` ${formatCurrency(item.parsed.y ?? 0)}` },
    },
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      beginAtZero: true,
      grid: { color: CHART_COLORS.grid },
      border: { display: false },
      ticks: { callback: (value) => formatCurrency(Number(value)) },
    },
  },
};
