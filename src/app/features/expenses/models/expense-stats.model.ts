import { MonthKey } from '@shared/utils/date.utils';
import { ExpenseCategory } from './expense.model';

export interface CategoryTotal {
  readonly category: ExpenseCategory;
  readonly total: number;
}

export interface MonthlyTotal {
  readonly month: MonthKey;
  readonly total: number;
}
