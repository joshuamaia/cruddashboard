import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { ExpenseStore } from '@features/expenses/state/expense.store';
import { EmptyState } from '@shared/components/empty-state/empty-state';
import { PageHeader } from '@shared/components/page-header/page-header';
import { ChartCard } from '../../components/chart-card/chart-card';
import { CategoryBarChart } from '../../components/charts/category-bar-chart';
import { CategoryDoughnutChart } from '../../components/charts/category-doughnut-chart';
import { MonthlyLineChart } from '../../components/charts/monthly-line-chart';
import { StatCard } from '../../components/stat-card/stat-card';

/**
 * PAGE COMPONENT do dashboard.
 *
 * Não calcula nada: lê os `computed()` do ExpenseStore (total, média,
 * totais por categoria/mês...). Como eles dependem da lista de despesas, a
 * tela se atualiza sozinha após qualquer cadastro, edição ou exclusão.
 */
@Component({
  selector: 'app-dashboard-page',
  imports: [
    CurrencyPipe,
    DecimalPipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PageHeader,
    EmptyState,
    StatCard,
    ChartCard,
    CategoryDoughnutChart,
    CategoryBarChart,
    MonthlyLineChart,
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
  protected readonly store = inject(ExpenseStore);
}
