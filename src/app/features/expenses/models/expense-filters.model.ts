import { IsoDate, isIsoDate } from '@shared/utils/date.utils';
import { ExpenseCategory, isExpenseCategory } from './expense.model';

/** Critérios da listagem. `null` significa "sem filtro" naquele campo. */
export interface ExpenseFilters {
  readonly search: string;
  readonly category: ExpenseCategory | null;
  readonly startDate: IsoDate | null;
  readonly endDate: IsoDate | null;
}

export const EMPTY_FILTERS: ExpenseFilters = {
  search: '',
  category: null,
  startDate: null,
  endDate: null,
};

export function isExpenseFilters(value: unknown): value is ExpenseFilters {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  const category = candidate['category'];
  const startDate = candidate['startDate'];
  const endDate = candidate['endDate'];
  return (
    typeof candidate['search'] === 'string' &&
    (category === null || isExpenseCategory(category)) &&
    (startDate === null || isIsoDate(startDate)) &&
    (endDate === null || isIsoDate(endDate))
  );
}
