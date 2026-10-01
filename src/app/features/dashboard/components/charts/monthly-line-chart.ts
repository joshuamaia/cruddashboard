import { Component, computed, input } from '@angular/core';
import { MonthlyTotal } from '@features/expenses/models/expense-stats.model';
import { BaseChartDirective } from 'ng2-charts';
import { toMonthlyLineData } from '../../services/chart-data';
import { LINE_OPTIONS } from '../../services/chart-options';

/** Gráfico de linha: evolução do total gasto mês a mês. */
@Component({
  selector: 'app-monthly-line-chart',
  imports: [BaseChartDirective],
  template: `
    <div class="chart">
      <canvas
        baseChart
        [type]="'line'"
        [data]="data()"
        [options]="options"
        role="img"
        aria-label="Gráfico de linha com a evolução dos gastos por mês"
      ></canvas>
    </div>
  `,
  styleUrl: './chart.scss',
})
export class MonthlyLineChart {
  readonly totals = input.required<readonly MonthlyTotal[]>();

  protected readonly data = computed(() => toMonthlyLineData(this.totals()));
  protected readonly options = LINE_OPTIONS;
}
