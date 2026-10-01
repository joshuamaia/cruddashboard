import { EXPENSE_CATEGORIES, isExpense } from '../models/expense.model';
import { MOCK_EXPENSES } from './expenses.mock';

describe('MOCK_EXPENSES', () => {
  it('has at least 10 valid records', () => {
    expect(MOCK_EXPENSES.length).toBeGreaterThanOrEqual(10);
    expect(MOCK_EXPENSES.every(isExpense)).toBe(true);
  });

  it('has unique ids', () => {
    const ids = new Set(MOCK_EXPENSES.map((expense) => expense.id));
    expect(ids.size).toBe(MOCK_EXPENSES.length);
  });

  it('covers every category', () => {
    const categories = new Set(MOCK_EXPENSES.map((expense) => expense.category));
    expect([...categories].sort()).toEqual([...EXPENSE_CATEGORIES].sort());
  });
});
