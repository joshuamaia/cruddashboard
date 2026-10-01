import { addMonths, format, isValid, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Data persistida no formato `yyyy-MM-dd`.
 *
 * Guardar só a data (sem horário e fuso) evita o clássico bug de a despesa do
 * dia 05 aparecer como dia 04 por causa da conversão para UTC. Além disso,
 * strings nesse formato podem ser comparadas diretamente (`a < b`): a ordem
 * alfabética coincide com a ordem cronológica.
 */
export type IsoDate = string;

/** Mês no formato `yyyy-MM`, usado para agrupar despesas. */
export type MonthKey = string;

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function toIsoDate(date: Date): IsoDate {
  return format(date, 'yyyy-MM-dd');
}

export function fromIsoDate(value: IsoDate): Date {
  return parseISO(value);
}

export function isIsoDate(value: unknown): value is IsoDate {
  return typeof value === 'string' && ISO_DATE_PATTERN.test(value) && isValid(parseISO(value));
}

export function toMonthKey(date: IsoDate): MonthKey {
  return date.slice(0, 7);
}

/** Próximo mês: `2026-12` → `2027-01`. */
export function nextMonthKey(month: MonthKey): MonthKey {
  return format(addMonths(parseISO(`${month}-01`), 1), 'yyyy-MM');
}

/** Rótulo curto em português: `2026-09` → `set/26`. */
export function formatMonthLabel(month: MonthKey): string {
  return format(parseISO(`${month}-01`), 'MMM/yy', { locale: ptBR });
}
