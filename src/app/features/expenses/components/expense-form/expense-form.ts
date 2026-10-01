import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { fromIsoDate, toIsoDate } from '@shared/utils/date.utils';
import { notBlank, positiveNumber } from '@shared/validators/form.validators';
import { CATEGORY_META, EXPENSE_TYPE_LABELS } from '../../models/expense-display';
import {
  Expense,
  EXPENSE_CATEGORIES,
  EXPENSE_TYPES,
  ExpenseCategory,
  ExpenseDraft,
  ExpenseType,
} from '../../models/expense.model';

export const DESCRIPTION_MAX_LENGTH = 80;

/**
 * Componente de APRESENTAÇÃO do formulário de despesa.
 *
 * Não conhece store, rotas ou persistência: recebe a despesa a editar por
 * `input()` e devolve um `ExpenseDraft` válido via `output()`. Quem decide se
 * vai criar ou atualizar é a página.
 */
@Component({
  selector: 'app-expense-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.scss',
})
export class ExpenseForm {
  /** Despesa em edição; `null` = cadastro de uma nova. */
  readonly expense = input<Expense | null>(null);
  readonly saving = input(false);

  readonly save = output<ExpenseDraft>();
  readonly cancel = output<void>();

  protected readonly categories = EXPENSE_CATEGORIES;
  protected readonly types = EXPENSE_TYPES;
  protected readonly categoryMeta = CATEGORY_META;
  protected readonly typeLabels = EXPENSE_TYPE_LABELS;
  protected readonly descriptionMaxLength = DESCRIPTION_MAX_LENGTH;

  /*
   * Typed Forms: o tipo de cada controle é inferido.
   *   form.controls.value.value  → number | null
   *   form.getRawValue()         → { description: string; category: ExpenseCategory | null; ... }
   *
   * NonNullableFormBuilder: ao chamar reset(), cada controle volta ao valor
   * INICIAL, e não para `null`. Por isso `description` é `string`, não `string | null`.
   */
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group({
    description: ['', [Validators.required, notBlank, Validators.maxLength(DESCRIPTION_MAX_LENGTH)]],
    category: this.fb.control<ExpenseCategory | null>(null, Validators.required),
    value: this.fb.control<number | null>(null, [Validators.required, positiveNumber]),
    date: this.fb.control<Date | null>(new Date(), Validators.required),
    type: this.fb.control<ExpenseType>('VARIAVEL'),
  });

  constructor() {
    /*
     * effect(): sincroniza um signal (o input `expense`) com algo que NÃO é
     * signal (o FormGroup). Isso é um efeito colateral legítimo.
     *
     * Por que não ngOnInit? O input pode mudar depois da criação. Exemplo:
     * ir de /expenses/a/edit para /expenses/b/edit reaproveita o componente.
     * O effect roda de novo sempre que `expense()` muda.
     */
    effect(() => {
      const expense = this.expense();
      if (expense) {
        this.form.setValue({
          description: expense.description,
          category: expense.category,
          value: expense.value,
          date: fromIsoDate(expense.date),
          type: expense.type,
        });
      } else {
        this.form.reset();
      }
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      // Mostra todas as mensagens de erro de uma vez.
      this.form.markAllAsTouched();
      return;
    }

    const { description, category, value, date, type } = this.form.getRawValue();
    // Os validators garantem que não são nulos, mas o TypeScript não sabe disso.
    // Este "narrowing" explícito evita usar o operador `!`.
    if (category === null || value === null || date === null) {
      return;
    }

    this.save.emit({
      description: description.trim(),
      category,
      value,
      date: toIsoDate(date),
      type,
    });
  }
}
