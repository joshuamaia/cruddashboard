import { Routes } from '@angular/router';

/**
 * Rotas da feature de despesas. Este arquivo inteiro só é baixado quando o
 * usuário acessa /expenses (lazy loading, configurado em app.routes.ts).
 *
 * `loadComponent` ainda divide cada página em seu próprio chunk.
 * `export default` permite usar `loadChildren: () => import(...)` sem `.then()`.
 */
export default [
  {
    path: '',
    title: 'Despesas | Expense Dashboard',
    loadComponent: () =>
      import('./pages/expense-list-page/expense-list-page').then((m) => m.ExpenseListPage),
  },
  {
    path: 'new',
    title: 'Nova despesa | Expense Dashboard',
    loadComponent: () =>
      import('./pages/expense-form-page/expense-form-page').then((m) => m.ExpenseFormPage),
  },
  {
    path: ':id/edit',
    title: 'Editar despesa | Expense Dashboard',
    loadComponent: () =>
      import('./pages/expense-form-page/expense-form-page').then((m) => m.ExpenseFormPage),
  },
] satisfies Routes;
