import { Component, computed, input } from '@angular/core';
import { CategoryTotal } from '@features/expenses/models/expense-stats.model';
import { BaseChartDirective } from 'ng2-charts';
import { toCategoryDoughnutData } from '../../services/chart-data';
import { DOUGHNUT_OPTIONS } from '../../services/chart-options';

/** Gráfico de rosca: participação de cada categoria no total. */
@Component({
  selector: 'app-category-doughnut-chart',
  imports: [BaseChartDirective],
  template: `
    <div class="chart">
      <canvas
        baseChart
        [type]="'doughnut'"
        [data]="data()"
        [options]="options"
        role="img"
        aria-label="Gráfico de rosca com a distribuição dos gastos por categoria"
      ></canvas>
    </div>
  `,
  styleUrl: './chart.scss',
})
export class CategoryDoughnutChart {
  readonly totals = input.required<readonly CategoryTotal[]>();

  /**
   * computed(): transforma os totais no formato do Chart.js. Gera um novo
   * objeto só quando `totals` muda; o ng2-charts percebe a nova referência e
   * redesenha o gráfico.
   */
  protected readonly data = computed(() => toCategoryDoughnutData(this.totals()));
  protected readonly options = DOUGHNUT_OPTIONS;
}
