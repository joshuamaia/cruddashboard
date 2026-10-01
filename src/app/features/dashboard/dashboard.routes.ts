import { Routes } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { CHART_DEFAULTS } from './services/chart-theme';

/**
 * Rotas da feature dashboard (carregada sob demanda).
 *
 * `providers` na rota: o Chart.js (~200 kB) é registrado AQUI, e não em
 * app.config.ts. Assim ele só vai para o chunk do dashboard e não pesa no
 * carregamento inicial de quem abre direto a listagem.
 */
export default [
  {
    path: '',
    title: 'Dashboard | Expense Dashboard',
    providers: [provideCharts(withDefaultRegisterables(), CHART_DEFAULTS)],
    loadComponent: () =>
      import('./pages/dashboard-page/dashboard-page').then((m) => m.DashboardPage),
  },
] satisfies Routes;
