import { Expense, ExpenseDraft } from '../models/expense.model';
import { ExpenseNotFoundError, ExpenseRepository } from './expense.repository';

/**
 * Implementação em memória do repositório.
 *
 * Usada nos testes do `ExpenseStore`: prova que o store funciona com
 * QUALQUER implementação da abstração, sem depender do localStorage.
 *
 *   providers: [{ provide: ExpenseRepository, useValue: new InMemoryExpenseRepository(seed) }]
 */
export class InMemoryExpenseRepository extends ExpenseRepository {
  private expenses: Expense[];
  private nextId = 1;

  constructor(initial: readonly Expense[] = []) {
    super();
    this.expenses = [...initial];
  }

  async getAll(): Promise<readonly Expense[]> {
    return [...this.expenses];
  }

  async create(draft: ExpenseDraft): Promise<Expense> {
    const expense: Expense = { ...draft, id: `mem-${this.nextId++}` };
    this.expenses = [...this.expenses, expense];
    return expense;
  }

  async update(expense: Expense): Promise<Expense> {
    if (!this.expenses.some((current) => current.id === expense.id)) {
      throw new ExpenseNotFoundError(expense.id);
    }
    this.expenses = this.expenses.map((current) => (current.id === expense.id ? expense : current));
    return expense;
  }

  async delete(id: string): Promise<void> {
    this.expenses = this.expenses.filter((expense) => expense.id !== id);
  }
}
