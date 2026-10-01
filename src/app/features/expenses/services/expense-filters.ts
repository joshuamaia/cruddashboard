import { Expense } from '../models/expense.model';
import { ExpenseFilters } from '../models/expense-filters.model';

/*
 * Funções PURAS: mesma entrada → mesma saída, sem efeitos colaterais.
 * O store as chama dentro de `computed()`. Separá-las facilita os testes
 * (não precisam de Angular) e mantém o store enxuto.
 */

/** Aplica todos os critérios ao mesmo tempo (E lógico). */
export function filterExpenses(
  expenses: readonly Expense[],
  filters: ExpenseFilters,
): Expense[] {
  const term = normalizeText(filters.search);

  return expenses.filter(
    (expense) =>
      (term === '' || normalizeText(expense.description).includes(term)) &&
      (filters.category === null || expense.category === filters.category) &&
      // Datas `yyyy-MM-dd` podem ser comparadas como string. Período inclusivo.
      (filters.startDate === null || expense.date >= filters.startDate) &&
      (filters.endDate === null || expense.date <= filters.endDate),
  );
}

export function hasActiveFilters(filters: ExpenseFilters): boolean {
  return (
    filters.search.trim() !== '' ||
    filters.category !== null ||
    filters.startDate !== null ||
    filters.endDate !== null
  );
}

/** Mais recentes primeiro. Retorna um NOVO array (não muta a entrada). */
export function sortByDateDesc(expenses: readonly Expense[]): Expense[] {
  return [...expenses].sort((a, b) => b.date.localeCompare(a.date));
}

/** Remove acentos e ignora maiúsculas: "SAÚDE" encontra "saude". */
function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}
