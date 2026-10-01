import { roundToCents } from '@shared/utils/currency.utils';
import { MonthKey, nextMonthKey, toMonthKey } from '@shared/utils/date.utils';
import { Expense, EXPENSE_CATEGORIES, ExpenseCategory } from '../models/expense.model';
import { CategoryTotal, MonthlyTotal } from '../models/expense-stats.model';

/* Funções puras de agregação, usadas pelo store em `computed()`. */

export function sumValues(expenses: readonly Expense[]): number {
  return roundToCents(expenses.reduce((sum, expense) => sum + expense.value, 0));
}

/** Retorna `null` (e não `undefined` ou 0) quando não há despesas: ausência explícita. */
export function findHighest(expenses: readonly Expense[]): Expense | null {
  return expenses.reduce<Expense | null>(
    (highest, expense) => (highest === null || expense.value > highest.value ? expense : highest),
    null,
  );
}

/** Média por despesa. Lista vazia → 0 (evita divisão por zero / NaN). */
export function averageValue(expenses: readonly Expense[]): number {
  return expenses.length === 0 ? 0 : roundToCents(sumValues(expenses) / expenses.length);
}

/** Total por categoria, do maior para o menor. Categorias sem gasto são omitidas. */
export function totalsByCategory(expenses: readonly Expense[]): CategoryTotal[] {
  const totals = new Map<ExpenseCategory, number>();
  for (const expense of expenses) {
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.value);
  }

  return EXPENSE_CATEGORIES.filter((category) => totals.has(category))
    .map((category) => ({ category, total: roundToCents(totals.get(category) ?? 0) }))
    .sort((a, b) => b.total - a.total);
}

/**
 * Total por mês, em ordem cronológica. Meses sem gastos entre o primeiro e o
 * último aparecem com total 0. Assim, o gráfico de linha não "pula" meses e
 * não esconde que naquele mês nada foi gasto.
 */
export function totalsByMonth(expenses: readonly Expense[]): MonthlyTotal[] {
  if (expenses.length === 0) {
    return [];
  }

  const totals = new Map<MonthKey, number>();
  for (const expense of expenses) {
    const month = toMonthKey(expense.date);
    totals.set(month, (totals.get(month) ?? 0) + expense.value);
  }

  const months = [...totals.keys()].sort();
  const first = months[0];
  const last = months[months.length - 1];

  const result: MonthlyTotal[] = [];
  for (let month = first; month <= last; month = nextMonthKey(month)) {
    result.push({ month, total: roundToCents(totals.get(month) ?? 0) });
  }
  return result;
}
