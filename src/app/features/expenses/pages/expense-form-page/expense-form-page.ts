import { Component, computed, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { EmptyState } from '@shared/components/empty-state/empty-state';
import { PageHeader } from '@shared/components/page-header/page-header';
import { ExpenseForm } from '../../components/expense-form/expense-form';
import { ExpenseDraft } from '../../models/expense.model';
import { ExpenseStore } from '../../state/expense.store';

/**
 * PAGE COMPONENT usado por duas rotas:
 *   /expenses/new       → cadastro (id indefinido)
 *   /expenses/:id/edit  → edição
 */
@Component({
  selector: 'app-expense-form-page',
  imports: [RouterLink, MatButtonModule, MatProgressSpinnerModule, PageHeader, EmptyState, ExpenseForm],
  templateUrl: './expense-form-page.html',
  styleUrl: './expense-form-page.scss',
})
export class ExpenseFormPage {
  /**
   * Preenchido AUTOMATICAMENTE pelo router com o parâmetro `:id`, graças a
   * `withComponentInputBinding()` em app.config.ts. Não é preciso injetar
   * ActivatedRoute nem assinar `paramMap`.
   */
  readonly id = input<string>();

  private readonly store = inject(ExpenseStore);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  // signal(): estado LOCAL desta tela (requisição de salvar em andamento).
  protected readonly saving = signal(false);

  // computed(): tudo abaixo é derivado de `id()` e do estado do store.
  protected readonly isEditMode = computed(() => this.id() !== undefined);

  /** Reage tanto à troca de id quanto ao fim do carregamento do store. */
  protected readonly expense = computed(() => {
    const id = this.id();
    return id === undefined ? null : this.store.findById(id);
  });

  protected readonly isLoading = computed(
    () => this.isEditMode() && this.store.status() !== 'loaded' && this.store.status() !== 'error',
  );

  protected readonly notFound = computed(
    () => this.isEditMode() && !this.isLoading() && this.expense() === null,
  );

  protected async save(draft: ExpenseDraft): Promise<void> {
    this.saving.set(true);
    try {
      const current = this.expense();
      if (current) {
        await this.store.update({ ...draft, id: current.id });
        this.snackBar.open('Despesa atualizada.', 'OK', { duration: 3000 });
      } else {
        await this.store.create(draft);
        this.snackBar.open('Despesa cadastrada.', 'OK', { duration: 3000 });
      }
      await this.router.navigate(['/expenses']);
    } catch {
      this.snackBar.open('Não foi possível salvar a despesa.', 'OK', { duration: 5000 });
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    void this.router.navigate(['/expenses']);
  }
}
