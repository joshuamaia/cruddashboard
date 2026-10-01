import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { fromIsoDate, toIsoDate } from '@shared/utils/date.utils';
import { CATEGORY_META } from '../../models/expense-display';
import { EXPENSE_CATEGORIES, ExpenseCategory } from '../../models/expense.model';
import { ExpenseFilters } from '../../models/expense-filters.model';

/**
 * Barra de filtros (APRESENTAÇÃO).
 *
 * Componente "controlado": não guarda estado próprio. Exibe os filtros
 * recebidos e emite as alterações; quem guarda o estado é o ExpenseStore.
 * Assim existe uma única fonte da verdade.
 */
@Component({
  selector: 'app-expense-filters-bar',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './expense-filters-bar.html',
  styleUrl: './expense-filters-bar.scss',
})
export class ExpenseFiltersBar {
  readonly filters = input.required<ExpenseFilters>();
  readonly hasActiveFilters = input(false);

  readonly filtersChange = output<Partial<ExpenseFilters>>();
  readonly clear = output<void>();

  protected readonly categories = EXPENSE_CATEGORIES;
  protected readonly categoryMeta = CATEGORY_META;

  // computed(): o DatePicker trabalha com `Date`, e o estado guarda `IsoDate`.
  // A conversão é derivada; não há motivo para guardar outra cópia.
  protected readonly startDate = computed(() => this.toDate(this.filters().startDate));
  protected readonly endDate = computed(() => this.toDate(this.filters().endDate));

  protected onSearch(event: Event): void {
    const { value } = event.target as HTMLInputElement;
    this.filtersChange.emit({ search: value });
  }

  protected onCategory(category: ExpenseCategory | null): void {
    this.filtersChange.emit({ category });
  }

  protected onStartDate(date: Date | null): void {
    this.filtersChange.emit({ startDate: date ? toIsoDate(date) : null });
  }

  protected onEndDate(date: Date | null): void {
    this.filtersChange.emit({ endDate: date ? toIsoDate(date) : null });
  }

  private toDate(value: string | null): Date | null {
    return value === null ? null : fromIsoDate(value);
  }
}
