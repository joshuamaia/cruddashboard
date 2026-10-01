import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { openConfirmDialog } from '@shared/components/confirm-dialog/confirm-dialog';
import { EmptyState } from '@shared/components/empty-state/empty-state';
import { PageHeader } from '@shared/components/page-header/page-header';
import { ExpenseFiltersBar } from '../../components/expense-filters-bar/expense-filters-bar';
import { ExpenseTable } from '../../components/expense-table/expense-table';
import { Expense } from '../../models/expense.model';
import { ExpenseStore } from '../../state/expense.store';

/**
 * PAGE COMPONENT da listagem.
 *
 * Papel: orquestrar. Lê o estado do store, repassa aos componentes de
 * apresentação e traduz os eventos deles em ações (navegar, excluir, filtrar).
 * Quase não tem HTML próprio.
 */
@Component({
  selector: 'app-expense-list-page',
  imports: [
    CurrencyPipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PageHeader,
    EmptyState,
    ExpenseFiltersBar,
    ExpenseTable,
  ],
  templateUrl: './expense-list-page.html',
  styleUrl: './expense-list-page.scss',
})
export class ExpenseListPage {
  // inject(): forma moderna de injeção, sem construtor. Funciona em
  // inicializadores de campo porque eles rodam no "injection context".
  protected readonly store = inject(ExpenseStore);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  protected edit(expense: Expense): void {
    void this.router.navigate(['/expenses', expense.id, 'edit']);
  }

  protected async remove(expense: Expense): Promise<void> {
    const confirmed = await openConfirmDialog(this.dialog, {
      title: 'Excluir despesa',
      message: `Deseja realmente excluir "${expense.description}"? Esta ação não pode ser desfeita.`,
      confirmLabel: 'Excluir',
    });
    if (!confirmed) {
      return;
    }

    try {
      await this.store.delete(expense.id);
      this.snackBar.open('Despesa excluída.', 'OK', { duration: 3000 });
    } catch {
      this.snackBar.open('Não foi possível excluir a despesa.', 'OK', { duration: 5000 });
    }
  }
}
