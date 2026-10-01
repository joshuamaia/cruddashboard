/**
 * Ciclo de vida de um carregamento assíncrono.
 *
 * Um union type de strings literais combina muito bem com `@switch` nos
 * templates: o compilador conhece todos os valores possíveis.
 */
export type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error';
