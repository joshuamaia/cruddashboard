import { FormControl } from '@angular/forms';
import { notBlank, positiveNumber } from './form.validators';

describe('form validators', () => {
  describe('positiveNumber', () => {
    it.each([0, -5])('rejects %s', (value) => {
      expect(positiveNumber(new FormControl(value))).toEqual({ positive: true });
    });

    it.each([0.01, 150])('accepts %s', (value) => {
      expect(positiveNumber(new FormControl(value))).toBeNull();
    });

    it('ignores empty values (handled by required)', () => {
      expect(positiveNumber(new FormControl(null))).toBeNull();
    });
  });

  describe('notBlank', () => {
    it('rejects whitespace-only text', () => {
      expect(notBlank(new FormControl('   '))).toEqual({ blank: true });
    });

    it('accepts real text and ignores empty text (handled by required)', () => {
      expect(notBlank(new FormControl(' Aluguel '))).toBeNull();
      expect(notBlank(new FormControl(''))).toBeNull();
    });
  });
});
