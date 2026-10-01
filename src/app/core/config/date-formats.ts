import { MatDateFormats } from '@angular/material/core';

/**
 * Formatos usados pelo DatePicker do Material (adaptador date-fns).
 * `parse` define o que o usuário pode digitar; `display`, como a data aparece.
 */
export const BR_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: ['dd/MM/yyyy', 'dd/MM/yy', 'ddMMyyyy'],
  },
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'PPP',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};
