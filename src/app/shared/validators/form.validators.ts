import { AbstractControl, ValidationErrors } from '@angular/forms';

/*
 * Validators customizados são apenas funções: recebem o controle e devolvem
 * `null` (válido) ou um objeto com os erros encontrados.
 */

/** Exige número maior que zero. Valor vazio fica a cargo do `Validators.required`. */
export function positiveNumber(control: AbstractControl<unknown>): ValidationErrors | null {
  const { value } = control;
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return typeof value === 'number' && value > 0 ? null : { positive: true };
}

/** Rejeita textos compostos só de espaços (o `required` aceitaria "   "). */
export function notBlank(control: AbstractControl<unknown>): ValidationErrors | null {
  const { value } = control;
  return typeof value === 'string' && value.length > 0 && value.trim().length === 0
    ? { blank: true }
    : null;
}
