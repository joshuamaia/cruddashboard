import { makeExpense } from '../testing/expense.fixtures';
import { averageValue, findHighest, sumValues, totalsByCategory, totalsByMonth } from './expense-stats';

describe('expense-stats', () => {
  describe('sumValues', () => {
    it('sums values rounded to cents', () => {
      const expenses = [makeExpense({ value: 0.1 }), makeExpense({ value: 0.2 })];
      expect(sumValues(expenses)).toBe(0.3);
    });

    it('returns 0 for an empty list', () => {
      expect(sumValues([])).toBe(0);
    });
  });

  describe('findHighest', () => {
    it('returns the expense with the highest value', () => {
      const highest = makeExpense({ value: 900 });
      expect(findHighest([makeExpense({ value: 10 }), highest, makeExpense({ value: 50 })])).toBe(highest);
    });

    it('returns null for an empty list', () => {
      expect(findHighest([])).toBeNull();
    });
  });

  describe('averageValue', () => {
    it('returns the average value', () => {
      expect(averageValue([makeExpense({ value: 100 }), makeExpense({ value: 50 })])).toBe(75);
    });

    it('returns 0 (not NaN) for an empty list', () => {
      expect(averageValue([])).toBe(0);
    });
  });

  describe('totalsByCategory', () => {
    it('groups by category, sorts by total and omits empty categories', () => {
      const result = totalsByCategory([
        makeExpense({ category: 'LAZER', value: 50 }),
        makeExpense({ category: 'MORADIA', value: 1000 }),
        makeExpense({ category: 'LAZER', value: 25.5 }),
      ]);

      expect(result).toEqual([
        { category: 'MORADIA', total: 1000 },
        { category: 'LAZER', total: 75.5 },
      ]);
    });

    it('returns an empty list when there are no expenses', () => {
      expect(totalsByCategory([])).toEqual([]);
    });
  });

  describe('totalsByMonth', () => {
    it('groups by month in chronological order and fills gaps with 0', () => {
      const result = totalsByMonth([
        makeExpense({ date: '2027-01-15', value: 30 }),
        makeExpense({ date: '2026-11-02', value: 10 }),
        makeExpense({ date: '2026-11-20', value: 5 }),
      ]);

      expect(result).toEqual([
        { month: '2026-11', total: 15 },
        { month: '2026-12', total: 0 },
        { month: '2027-01', total: 30 },
      ]);
    });

    it('returns an empty list when there are no expenses', () => {
      expect(totalsByMonth([])).toEqual([]);
    });
  });
});
