import { IsoDate, isIsoDate } from '@shared/utils/date.utils';

/*
 * Os arrays `as const` são a fonte única da verdade: deles derivamos os
 * tipos (union types) e também iteramos nos templates (`@for`) para montar
 * selects. Para adicionar uma categoria, basta incluí-la aqui. O compilador
 * aponta todos os lugares que precisam ser atualizados (ex.: CATEGORY_META).
 */
export const EXPENSE_CATEGORIES = [
  'ALIMENTACAO',
  'TRANSPORTE',
  'MORADIA',
  'SAUDE',
  'EDUCACAO',
  'LAZER',
  'OUTROS',
] as const;

/** 'ALIMENTACAO' | 'TRANSPORTE' | ... */
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const EXPENSE_TYPES = ['FIXA', 'VARIAVEL'] as const;

/** 'FIXA' | 'VARIAVEL' */
export type ExpenseType = (typeof EXPENSE_TYPES)[number];

/**
 * Entidade principal. Todas as propriedades são `readonly`: uma despesa
 * nunca é alterada "por dentro". Para alterar, criamos um objeto novo, o
 * que é exatamente o que os Signals precisam para detectar mudanças.
 */
export interface Expense {
  readonly id: string;
  readonly description: string;
  readonly category: ExpenseCategory;
  readonly value: number;
  readonly date: IsoDate;
  readonly type: ExpenseType;
}

/** Dados de uma despesa ainda não persistida (o id é gerado pelo repositório). */
export type ExpenseDraft = Omit<Expense, 'id'>;

export function isExpenseCategory(value: unknown): value is ExpenseCategory {
  return typeof value === 'string' && (EXPENSE_CATEGORIES as readonly string[]).includes(value);
}

export function isExpenseType(value: unknown): value is ExpenseType {
  return typeof value === 'string' && (EXPENSE_TYPES as readonly string[]).includes(value);
}

/**
 * Type guard: valida em runtime um dado de origem desconhecida (localStorage,
 * API...). Se retornar true, o TypeScript passa a tratá-lo como `Expense`.
 */
export function isExpense(value: unknown): value is Expense {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate['id'] === 'string' &&
    typeof candidate['description'] === 'string' &&
    isExpenseCategory(candidate['category']) &&
    typeof candidate['value'] === 'number' &&
    isIsoDate(candidate['date']) &&
    isExpenseType(candidate['type'])
  );
}
