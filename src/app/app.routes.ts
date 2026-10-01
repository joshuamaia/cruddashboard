import { Routes } from '@angular/router';

/**
 * Rotas raiz. Cada feature é carregada sob demanda (lazy loading):
 * `loadChildren` com `import()` dinâmico faz o bundler gerar um chunk
 * separado, baixado só quando a rota é acessada pela primeira vez.
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    loadChildren: () => import('@features/dashboard/dashboard.routes'),
  },
  {
    path: 'expenses',
    loadChildren: () => import('@features/expenses/expenses.routes'),
  },
  { path: '**', redirectTo: 'dashboard' },
];
