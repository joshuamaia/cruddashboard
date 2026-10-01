import { NgChartsConfiguration } from 'ng2-charts';

/*
 * Tokens visuais dos gráficos. O canvas do Chart.js não lê variáveis CSS,
 * então os valores ficam centralizados aqui.
 */
export const CHART_COLORS = {
  surface: '#ffffff',
  text: '#52514e',
  grid: '#e1e0d9',
  /** Cor da série única do gráfico de linha. */
  primarySeries: '#2a78d6',
} as const;

/** Defaults globais do Chart.js, aplicados via `provideCharts()`. */
export const CHART_DEFAULTS: NgChartsConfiguration = {
  defaults: {
    color: CHART_COLORS.text,
    font: { family: "Roboto, 'Helvetica Neue', sans-serif", size: 12 },
    maintainAspectRatio: false,
  },
};
