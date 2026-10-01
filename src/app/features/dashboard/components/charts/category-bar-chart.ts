import { Component, computed, input } from '@angular/core';
import { CategoryTotal } from '@features/expenses/models/expense-stats.model';
import { BaseChartDirective } from 'ng2-charts';
import { toCategoryBarData } from '../../services/chart-data';
import { BAR_OPTIONS } from '../../services/chart-options';

/** Gráfico de barras: valor total gasto em cada categoria. */
@Component({
  selector: 'app-category-bar-chart',
  imports: [BaseChartDirective],
  template: `
    <div class="chart">
      <canvas
        baseChart
        [type]="'bar'"
        [data]="data()"
        [options]="options"
        role="img"
        aria-label="Gráfico de barras com o total gasto por categoria"
      ></canvas>
    </div>
  `,
  styleUrl: './chart.scss',
})
export class CategoryBarChart {
  readonly totals = input.required<readonly CategoryTotal[]>();

  protected readonly data = computed(() => toCategoryBarData(this.totals()));
  protected readonly options = BAR_OPTIONS;
}
