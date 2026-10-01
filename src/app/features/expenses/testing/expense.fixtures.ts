import { Expense } from '../models/expense.model';

let sequence = 0;

/** Cria uma despesa válida para testes; sobrescreva só o que importa no cenário. */
export function makeExpense(overrides: Partial<Expense> = {}): Expense {
  sequence += 1;
  return {
    id: `test-${sequence}`,
    description: `Despesa ${sequence}`,
    category: 'OUTROS',
    value: 100,
    date: '2026-09-01',
    type: 'VARIAVEL',
    ...overrides,
  };
}
