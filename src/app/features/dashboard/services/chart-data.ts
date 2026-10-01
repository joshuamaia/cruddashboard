import { ChartData } from 'chart.js';
import { CATEGORY_META } from '@features/expenses/models/expense-display';
import { CategoryTotal, MonthlyTotal } from '@features/expenses/models/expense-stats.model';
import { formatMonthLabel } from '@shared/utils/date.utils';
import { CHART_COLORS } from './chart-theme';

/*
 * Mappers PUROS: dados de domínio → formato que o Chart.js entende.
 *
 * O store calcula os totais (domínio) e os componentes de gráfico chamam
 * estes mappers dentro de `computed()`. Assim cada camada tem uma
 * responsabilidade, e o Chart.js não "vaza" para o resto da aplicação.
 *
 * As cores vêm de CATEGORY_META: a cor acompanha a categoria (Moradia é
 * sempre verde-água), independentemente da posição no ranking.
 */

export function toCategoryDoughnutData(
  totals: readonly CategoryTotal[],
): ChartData<'doughnut', number[], string> {
  return {
    labels: totals.map(({ category }) => CATEGORY_META[category].label),
    datasets: [
      {
        data: totals.map(({ total }) => total),
        backgroundColor: totals.map(({ category }) => CATEGORY_META[category].color),
        // Borda da cor do fundo = espaçamento de 2px entre as fatias.
        borderColor: CHART_COLORS.surface,
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };
}

export function toCategoryBarData(
  totals: readonly CategoryTotal[],
): ChartData<'bar', number[], string> {
  return {
    labels: totals.map(({ category }) => CATEGORY_META[category].label),
    datasets: [
      {
        label: 'Total gasto',
        data: totals.map(({ total }) => total),
        backgroundColor: totals.map(({ category }) => CATEGORY_META[category].color),
        borderRadius: 4,
        // Mantém reta a ponta encostada no eixo; arredonda só a ponta livre.
        borderSkipped: 'start',
        maxBarThickness: 28,
      },
    ],
  };
}

export function toMonthlyLineData(
  totals: readonly MonthlyTotal[],
): ChartData<'line', number[], string> {
  return {
    labels: totals.map(({ month }) => formatMonthLabel(month)),
    datasets: [
      {
        label: 'Total no mês',
        data: totals.map(({ total }) => total),
        borderColor: CHART_COLORS.primarySeries,
        backgroundColor: CHART_COLORS.primarySeries,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBorderColor: CHART_COLORS.surface,
        pointBorderWidth: 2,
        tension: 0.25,
      },
    ],
  };
}
