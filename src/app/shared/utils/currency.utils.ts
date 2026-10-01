const brlFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/**
 * Formata em reais fora dos templates (ex.: tooltips do Chart.js).
 * Nos templates, prefira o pipe `currency`.
 */
export function formatCurrency(value: number): string {
  return brlFormatter.format(value);
}

/** Arredonda para centavos, evitando resíduos como 0.1 + 0.2 = 0.30000000000000004. */
export function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}
