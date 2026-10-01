import { EMPTY_FILTERS, ExpenseFilters } from '../models/expense-filters.model';
import { makeExpense } from '../testing/expense.fixtures';
import { filterExpenses, hasActiveFilters, sortByDateDesc } from './expense-filters';

describe('expense-filters', () => {
  const rent = makeExpense({ description: 'Aluguel', category: 'MORADIA', date: '2026-08-05' });
  const health = makeExpense({ description: 'Plano de Saúde', category: 'SAUDE', date: '2026-08-20' });
  const market = makeExpense({ description: 'Supermercado', category: 'ALIMENTACAO', date: '2026-09-10' });
  const expenses = [rent, health, market];

  const withFilters = (changes: Partial<ExpenseFilters>): ExpenseFilters => ({
    ...EMPTY_FILTERS,
    ...changes,
  });

  describe('filterExpenses', () => {
    it('returns everything when no filter is set', () => {
      expect(filterExpenses(expenses, EMPTY_FILTERS)).toEqual(expenses);
    });

    it('searches the description ignoring case and accents', () => {
      expect(filterExpenses(expenses, withFilters({ search: 'SAUDE' }))).toEqual([health]);
      expect(filterExpenses(expenses, withFilters({ search: '  super ' }))).toEqual([market]);
    });

    it('filters by category', () => {
      expect(filterExpenses(expenses, withFilters({ category: 'MORADIA' }))).toEqual([rent]);
    });

    it('filters by an inclusive period', () => {
      const result = filterExpenses(
        expenses,
        withFilters({ startDate: '2026-08-05', endDate: '2026-08-20' }),
      );
      expect(result).toEqual([rent, health]);
    });

    it('accepts an open-ended period', () => {
      expect(filterExpenses(expenses, withFilters({ startDate: '2026-09-01' }))).toEqual([market]);
      expect(filterExpenses(expenses, withFilters({ endDate: '2026-08-10' }))).toEqual([rent]);
    });

    it('combines all criteria', () => {
      const result = filterExpenses(
        expenses,
        withFilters({ search: 'a', category: 'SAUDE', startDate: '2026-08-01', endDate: '2026-08-31' }),
      );
      expect(result).toEqual([health]);
    });

    it('does not mutate the input array', () => {
      const input = [...expenses];
      filterExpenses(input, withFilters({ category: 'SAUDE' }));
      expect(input).toEqual(expenses);
    });
  });

  describe('hasActiveFilters', () => {
    it('is false for empty filters and a blank search', () => {
      expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false);
      expect(hasActiveFilters(withFilters({ search: '   ' }))).toBe(false);
    });

    it('is true when any criterion is set', () => {
      expect(hasActiveFilters(withFilters({ search: 'x' }))).toBe(true);
      expect(hasActiveFilters(withFilters({ category: 'LAZER' }))).toBe(true);
      expect(hasActiveFilters(withFilters({ endDate: '2026-01-01' }))).toBe(true);
    });
  });

  describe('sortByDateDesc', () => {
    it('returns a new array with the most recent first', () => {
      const sorted = sortByDateDesc(expenses);
      expect(sorted).toEqual([market, health, rent]);
      expect(sorted).not.toBe(expenses);
    });
  });
});
