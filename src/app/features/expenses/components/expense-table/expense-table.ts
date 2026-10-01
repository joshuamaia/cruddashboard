import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CATEGORY_META, EXPENSE_TYPE_LABELS } from '../../models/expense-display';
import { Expense } from '../../models/expense.model';

/**
 * Tabela de despesas (APRESENTAÇÃO): recebe a lista pronta (já filtrada e
 * ordenada pelo store) e apenas avisa quando o usuário quer editar/excluir.
 */
@Component({
  selector: 'app-expense-table',
  imports: [CurrencyPipe, DatePipe, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './expense-table.html',
  styleUrl: './expense-table.scss',
})
export class ExpenseTable {
  readonly expenses = input.required<readonly Expense[]>();

  readonly edit = output<Expense>();
  readonly remove = output<Expense>();

  protected readonly categoryMeta = CATEGORY_META;
  protected readonly typeLabels = EXPENSE_TYPE_LABELS;
}
