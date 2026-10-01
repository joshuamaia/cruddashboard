import { inject, Injectable, InjectionToken } from '@angular/core';
import { LocalStorageService } from '@core/services/local-storage.service';
import { MOCK_EXPENSES } from '../data/expenses.mock';
import { Expense, ExpenseDraft, isExpense } from '../models/expense.model';
import { ExpenseNotFoundError, ExpenseRepository } from './expense.repository';

export const EXPENSES_STORAGE_KEY = 'expense-dashboard:expenses';

/**
 * Atraso artificial (ms) para simular uma API real e permitir ver os estados
 * de "carregando" na interface. Nos testes, é sobrescrito para 0.
 */
export const REPOSITORY_LATENCY_MS = new InjectionToken<number>('REPOSITORY_LATENCY_MS', {
  factory: () => 300,
});

/** Implementação do repositório usando o localStorage do navegador. */
@Injectable()
export class LocalStorageExpenseRepository extends ExpenseRepository {
  private readonly storage = inject(LocalStorageService);
  private readonly latencyMs = inject(REPOSITORY_LATENCY_MS);

  async getAll(): Promise<readonly Expense[]> {
    await this.simulateLatency();
    return this.readAll();
  }

  async create(draft: ExpenseDraft): Promise<Expense> {
    await this.simulateLatency();
    const expense: Expense = { ...draft, id: crypto.randomUUID() };
    this.writeAll([...this.readAll(), expense]);
    return expense;
  }

  async update(expense: Expense): Promise<Expense> {
    await this.simulateLatency();
    const all = this.readAll();
    if (!all.some((current) => current.id === expense.id)) {
      throw new ExpenseNotFoundError(expense.id);
    }
    this.writeAll(all.map((current) => (current.id === expense.id ? expense : current)));
    return expense;
  }

  async delete(id: string): Promise<void> {
    await this.simulateLatency();
    this.writeAll(this.readAll().filter((expense) => expense.id !== id));
  }

  /**
   * Lê e valida os dados salvos. Se a chave ainda não existe (primeiro
   * acesso), grava os dados mockados. Uma lista vazia NÃO é semeada de novo:
   * se o usuário excluiu tudo, respeitamos isso.
   */
  private readAll(): readonly Expense[] {
    const stored = this.storage.read(EXPENSES_STORAGE_KEY);
    if (stored === null) {
      this.writeAll(MOCK_EXPENSES);
      return MOCK_EXPENSES;
    }
    return Array.isArray(stored) ? stored.filter(isExpense) : [];
  }

  private writeAll(expenses: readonly Expense[]): void {
    this.storage.write(EXPENSES_STORAGE_KEY, expenses);
  }

  private simulateLatency(): Promise<void> {
    if (this.latencyMs <= 0) {
      return Promise.resolve();
    }
    return new Promise((resolve) => setTimeout(resolve, this.latencyMs));
  }
}
