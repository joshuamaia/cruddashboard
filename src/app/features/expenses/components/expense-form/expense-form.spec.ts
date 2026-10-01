import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { BR_DATE_FORMATS } from '@core/config/date-formats';
import { ptBR } from 'date-fns/locale';
import { ExpenseDraft } from '../../models/expense.model';
import { makeExpense } from '../../testing/expense.fixtures';
import { ExpenseForm } from './expense-form';

describe('ExpenseForm', () => {
  let fixture: ComponentFixture<ExpenseForm>;
  let component: ExpenseForm;
  let emitted: ExpenseDraft | undefined;

  /** Acesso ao FormGroup protegido (a notação de colchetes é permitida em testes). */
  const form = () => component['form'];
  const submit = () =>
    (fixture.nativeElement as HTMLElement).querySelector('form')?.dispatchEvent(new Event('submit'));

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ExpenseForm],
      providers: [provideDateFnsAdapter(BR_DATE_FORMATS), { provide: MAT_DATE_LOCALE, useValue: ptBR }],
    });
    fixture = TestBed.createComponent(ExpenseForm);
    component = fixture.componentInstance;
    emitted = undefined;
    component.save.subscribe((draft) => (emitted = draft));
    await fixture.whenStable();
  });

  it('starts invalid and does not emit when submitted empty', () => {
    expect(form().invalid).toBe(true);

    submit();

    expect(emitted).toBeUndefined();
    expect(form().controls.description.touched).toBe(true);
  });

  it('rejects a value that is not greater than zero', () => {
    form().controls.value.setValue(0);
    expect(form().controls.value.hasError('positive')).toBe(true);
  });

  it('emits a trimmed draft with an ISO date when valid', () => {
    form().setValue({
      description: '  Farmácia  ',
      category: 'SAUDE',
      value: 42.5,
      date: new Date(2026, 8, 5),
      type: 'VARIAVEL',
    });

    submit();

    expect(emitted).toEqual({
      description: 'Farmácia',
      category: 'SAUDE',
      value: 42.5,
      date: '2026-09-05',
      type: 'VARIAVEL',
    });
  });

  it('fills the form when an expense is provided (effect)', async () => {
    const expense = makeExpense({ description: 'Aluguel', category: 'MORADIA', value: 1800, date: '2026-09-05', type: 'FIXA' });

    fixture.componentRef.setInput('expense', expense);
    await fixture.whenStable();

    expect(form().getRawValue()).toEqual({
      description: 'Aluguel',
      category: 'MORADIA',
      value: 1800,
      date: new Date(2026, 8, 5),
      type: 'FIXA',
    });
  });
});
