import { ExpenseCategory, ExpenseType } from './expense.model';

export interface CategoryMeta {
  readonly label: string;
  /** Nome do ícone em Material Symbols. */
  readonly icon: string;
  /** Cor da categoria nos gráficos: a cor acompanha a categoria, nunca a posição. */
  readonly color: string;
}

/**
 * `Record<ExpenseCategory, ...>` obriga a existir uma entrada para cada
 * categoria. Se uma categoria nova for criada e esquecida aqui, o build falha.
 */
export const CATEGORY_META: Readonly<Record<ExpenseCategory, CategoryMeta>> = {
  ALIMENTACAO: { label: 'Alimentação', icon: 'restaurant', color: '#2a78d6' },
  TRANSPORTE: { label: 'Transporte', icon: 'directions_car', color: '#eb6834' },
  MORADIA: { label: 'Moradia', icon: 'home', color: '#1baf7a' },
  SAUDE: { label: 'Saúde', icon: 'health_and_safety', color: '#eda100' },
  EDUCACAO: { label: 'Educação', icon: 'school', color: '#e87ba4' },
  LAZER: { label: 'Lazer', icon: 'sports_esports', color: '#008300' },
  OUTROS: { label: 'Outros', icon: 'category', color: '#4a3aa7' },
};

export const EXPENSE_TYPE_LABELS: Readonly<Record<ExpenseType, string>> = {
  FIXA: 'Fixa',
  VARIAVEL: 'Variável',
};
