import { Expense, ExpenseDraft } from '../models/expense.model';

/**
 * Contrato de persistência das despesas (padrão Repository).
 *
 * O `ExpenseStore` depende APENAS desta abstração. A implementação concreta é
 * escolhida em `app.config.ts`:
 *
 *   { provide: ExpenseRepository, useClass: LocalStorageExpenseRepository }
 *
 * Para usar uma API REST no futuro, basta criar um `HttpExpenseRepository`
 * (com `HttpClient`) e trocar essa linha. Store, páginas e componentes não mudam.
 *
 * Por que classe abstrata e não interface? Interfaces somem na compilação;
 * classes existem em runtime e podem ser usadas como token de injeção.
 *
 * Por que Promise? Toda persistência real é assíncrona. Já nascer assíncrono
 * evita reescrever o store quando o backend chegar.
 */
export abstract class ExpenseRepository {
  abstract getAll(): Promise<readonly Expense[]>;
  abstract create(draft: ExpenseDraft): Promise<Expense>;
  abstract update(expense: Expense): Promise<Expense>;
  abstract delete(id: string): Promise<void>;
}

export class ExpenseNotFoundError extends Error {
  constructor(readonly expenseId: string) {
    super(`Despesa "${expenseId}" não encontrada.`);
    this.name = 'ExpenseNotFoundError';
  }
}
