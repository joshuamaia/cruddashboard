import { TestBed } from '@angular/core/testing';
import { Expense } from '../models/expense.model';
import { EMPTY_FILTERS } from '../models/expense-filters.model';
import { ExpenseRepository } from '../services/expense.repository';
import { InMemoryExpenseRepository } from '../services/in-memory-expense.repository';
import { makeExpense } from '../testing/expense.fixtures';
import { ExpenseStore, FILTERS_STORAGE_KEY } from './expense.store';

describe('ExpenseStore', () => {
  const rent = makeExpense({ description: 'Aluguel', category: 'MORADIA', value: 1500, date: '2026-08-05' });
  const market = makeExpense({ description: 'Mercado', category: 'ALIMENTACAO', value: 400, date: '2026-09-10' });
  const cinema = makeExpense({ description: 'Cinema', category: 'LAZER', value: 100, date: '2026-09-12' });

  let repository: InMemoryExpenseRepository;
  let store: ExpenseStore;

  /** Cria o store com um repositório em memória: nada de localStorage para as despesas. */
  function createStore(seed: readonly Expense[] = [rent, market, cinema]): ExpenseStore {
    repository = new InMemoryExpenseRepository(seed);
    TestBed.configureTestingModule({
      providers: [{ provide: ExpenseRepository, useValue: repository }],
    });
    return TestBed.inject(ExpenseStore);
  }

  beforeEach(() => {
    localStorage.clear();
  });

  describe('load', () => {
    it('starts idle and empty', () => {
      store = createStore();
      expect(store.status()).toBe('idle');
      expect(store.expenses()).toEqual([]);
    });

    it('loads the expenses from the repository', async () => {
      store = createStore();
      await store.load();

      expect(store.status()).toBe('loaded');
      expect(store.expenses()).toEqual([rent, market, cinema]);
    });

    it('sets the error status when the repository fails', async () => {
      store = createStore();
      vi.spyOn(repository, 'getAll').mockRejectedValue(new Error('offline'));
      vi.spyOn(console, 'error').mockImplementation(() => undefined);

      await store.load();

      expect(store.status()).toBe('error');
    });
  });

  describe('dashboard computed values', () => {
    beforeEach(async () => {
      store = createStore();
      await store.load();
    });

    it('calculates total, count, highest and average', () => {
      expect(store.total()).toBe(2000);
      expect(store.count()).toBe(3);
      expect(store.highest()).toEqual(rent);
      expect(store.average()).toBe(666.67);
    });

    it('calculates the totals by category', () => {
      expect(store.totalsByCategory()).toEqual([
        { category: 'MORADIA', total: 1500 },
        { category: 'ALIMENTACAO', total: 400 },
        { category: 'LAZER', total: 100 },
      ]);
    });

    it('calculates the totals by month', () => {
      expect(store.totalsByMonth()).toEqual([
        { month: '2026-08', total: 1500 },
        { month: '2026-09', total: 500 },
      ]);
    });

  });

  it('handles an empty list without NaN or undefined', async () => {
    store = createStore([]);
    await store.load();

    expect(store.total()).toBe(0);
    expect(store.average()).toBe(0);
    expect(store.highest()).toBeNull();
    expect(store.totalsByCategory()).toEqual([]);
  });

  describe('create / update / delete', () => {
    beforeEach(async () => {
      store = createStore();
      await store.load();
    });

    it('creates an expense and recalculates the derived values', async () => {
      const created = await store.create({
        description: 'Curso',
        category: 'EDUCACAO',
        value: 3000,
        date: '2026-09-20',
        type: 'FIXA',
      });

      expect(store.expenses()).toContainEqual(created);
      expect(store.count()).toBe(4);
      expect(store.total()).toBe(5000);
      expect(store.highest()).toEqual(created);
      expect(await repository.getAll()).toContainEqual(created);
    });

    it('updates an expense in place', async () => {
      await store.update({ ...market, value: 600 });

      expect(store.findById(market.id)?.value).toBe(600);
      expect(store.count()).toBe(3);
      expect(store.total()).toBe(2200);
    });

    it('deletes an expense and recalculates the derived values', async () => {
      await store.delete(rent.id);

      expect(store.findById(rent.id)).toBeNull();
      expect(store.count()).toBe(2);
      expect(store.total()).toBe(500);
      expect(store.highest()).toEqual(market);
      expect(store.totalsByCategory().map((item) => item.category)).not.toContain('MORADIA');
    });

    it('creates a new array reference on each change (immutability)', async () => {
      const before = store.expenses();
      await store.delete(cinema.id);
      expect(store.expenses()).not.toBe(before);
      expect(before).toHaveLength(3);
    });

    it('keeps the state unchanged when the repository fails', async () => {
      vi.spyOn(repository, 'delete').mockRejectedValue(new Error('offline'));

      await expect(store.delete(rent.id)).rejects.toThrow('offline');
      expect(store.count()).toBe(3);
    });
  });

  describe('filters', () => {
    beforeEach(async () => {
      store = createStore();
      await store.load();
    });

    it('lists every expense, most recent first, when no filter is active', () => {
      expect(store.hasActiveFilters()).toBe(false);
      expect(store.filteredExpenses()).toEqual([cinema, market, rent]);
    });

    it('filters by search term', () => {
      store.patchFilters({ search: 'merc' });

      expect(store.hasActiveFilters()).toBe(true);
      expect(store.filteredExpenses()).toEqual([market]);
      expect(store.filteredTotal()).toBe(400);
    });

    it('filters by category and period, keeping the other criteria', () => {
      store.patchFilters({ startDate: '2026-09-01' });
      store.patchFilters({ category: 'LAZER' });

      expect(store.filters()).toEqual({ ...EMPTY_FILTERS, startDate: '2026-09-01', category: 'LAZER' });
      expect(store.filteredExpenses()).toEqual([cinema]);
    });

    it('reacts to new expenses while a filter is active', async () => {
      store.patchFilters({ category: 'LAZER' });
      await store.create({ description: 'Show', category: 'LAZER', value: 200, date: '2026-09-25', type: 'VARIAVEL' });

      expect(store.filteredExpenses().map((expense) => expense.description)).toEqual(['Show', 'Cinema']);
    });

    it('clears all filters', () => {
      store.patchFilters({ search: 'x', category: 'SAUDE' });
      store.clearFilters();

      expect(store.filters()).toEqual(EMPTY_FILTERS);
      expect(store.filteredExpenses()).toHaveLength(3);
    });

    it('persists the filters in localStorage through an effect', () => {
      store.patchFilters({ category: 'MORADIA' });
      // Effects rodam de forma agendada; tick() executa os pendentes.
      TestBed.tick();

      const saved = JSON.parse(localStorage.getItem(FILTERS_STORAGE_KEY) ?? 'null');
      expect(saved).toEqual({ ...EMPTY_FILTERS, category: 'MORADIA' });
    });
  });

  it('restores valid filters saved in localStorage', () => {
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify({ ...EMPTY_FILTERS, search: 'aluguel' }));
    store = createStore();
    expect(store.filters().search).toBe('aluguel');
  });

  it('ignores invalid filters saved in localStorage', () => {
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify({ category: 'INVALIDA' }));
    store = createStore();
    expect(store.filters()).toEqual(EMPTY_FILTERS);
  });
});
