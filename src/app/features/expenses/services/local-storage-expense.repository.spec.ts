import { TestBed } from '@angular/core/testing';
import { MOCK_EXPENSES } from '../data/expenses.mock';
import { makeExpense } from '../testing/expense.fixtures';
import { ExpenseNotFoundError } from './expense.repository';
import {
  EXPENSES_STORAGE_KEY,
  LocalStorageExpenseRepository,
  REPOSITORY_LATENCY_MS,
} from './local-storage-expense.repository';

describe('LocalStorageExpenseRepository', () => {
  let repository: LocalStorageExpenseRepository;

  const stored = (): unknown => JSON.parse(localStorage.getItem(EXPENSES_STORAGE_KEY) ?? 'null');

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [LocalStorageExpenseRepository, { provide: REPOSITORY_LATENCY_MS, useValue: 0 }],
    });
    repository = TestBed.inject(LocalStorageExpenseRepository);
  });

  it('seeds the mock data on first access', async () => {
    expect(await repository.getAll()).toEqual(MOCK_EXPENSES);
    expect(stored()).toEqual(MOCK_EXPENSES);
  });

  it('does not reseed when the user deleted everything', async () => {
    localStorage.setItem(EXPENSES_STORAGE_KEY, '[]');
    expect(await repository.getAll()).toEqual([]);
  });

  it('discards invalid records', async () => {
    const valid = makeExpense();
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify([valid, { id: 1, value: 'x' }]));
    expect(await repository.getAll()).toEqual([valid]);
  });

  it('creates an expense with a generated id', async () => {
    localStorage.setItem(EXPENSES_STORAGE_KEY, '[]');
    const created = await repository.create({
      description: 'Teste',
      category: 'LAZER',
      value: 10,
      date: '2026-09-01',
      type: 'VARIAVEL',
    });

    expect(created.id).toBeTruthy();
    expect(stored()).toEqual([created]);
  });

  it('updates and deletes an expense', async () => {
    const expense = makeExpense({ value: 10 });
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify([expense]));

    await repository.update({ ...expense, value: 20 });
    expect(stored()).toEqual([{ ...expense, value: 20 }]);

    await repository.delete(expense.id);
    expect(stored()).toEqual([]);
  });

  it('rejects updating an unknown expense', async () => {
    localStorage.setItem(EXPENSES_STORAGE_KEY, '[]');
    await expect(repository.update(makeExpense())).rejects.toBeInstanceOf(ExpenseNotFoundError);
  });
});
