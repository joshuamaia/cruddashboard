import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { LoadStatus } from '@core/models/load-status';
import { LocalStorageService } from '@core/services/local-storage.service';
import { Expense, ExpenseDraft } from '../models/expense.model';
import { EMPTY_FILTERS, ExpenseFilters, isExpenseFilters } from '../models/expense-filters.model';
import { filterExpenses, hasActiveFilters, sortByDateDesc } from '../services/expense-filters';
import { ExpenseRepository } from '../services/expense.repository';
import {
  averageValue,
  findHighest,
  sumValues,
  totalsByCategory,
  totalsByMonth,
} from '../services/expense-stats';

export const FILTERS_STORAGE_KEY = 'expense-dashboard:filters';

/**
 * Store das despesas: a ÚNICA fonte da verdade sobre esse estado.
 *
 * Os três primitivos de Signals, cada um com seu papel:
 *
 * ┌────────────┬──────────────────────────────────────────────────────────┐
 * │ signal()   │ ESTADO: valor que muda por ação (carregar, criar, filtrar).│
 * │ computed() │ DERIVADO: calculado a partir de outros signals. Memoizado │
 * │            │ e recalculado só quando uma dependência muda.             │
 * │ effect()   │ EFEITO COLATERAL: sincronizar com algo FORA do mundo dos  │
 * │            │ signals (localStorage, DOM, log). Nunca para derivar estado.│
 * └────────────┴──────────────────────────────────────────────────────────┘
 *
 * Regra de ouro: se um valor pode ser CALCULADO a partir de outros signals,
 * ele é `computed()`, e não um `signal()` atualizado manualmente.
 */
@Injectable({ providedIn: 'root' })
export class ExpenseStore {
  private readonly repository = inject(ExpenseRepository);
  private readonly storage = inject(LocalStorageService);

  // ─── Estado (signal) ──────────────────────────────────────────────────────
  // Privado e gravável: só o próprio store pode alterá-lo.
  private readonly _expenses = signal<readonly Expense[]>([]);
  private readonly _status = signal<LoadStatus>('idle');
  private readonly _filters = signal<ExpenseFilters>(this.restoreFilters());

  // Expostos como somente leitura: quem consome lê `store.expenses()`, mas
  // não tem acesso a `.set()` ou `.update()`.
  readonly expenses = this._expenses.asReadonly();
  readonly status = this._status.asReadonly();
  readonly filters = this._filters.asReadonly();

  // ─── Derivados da listagem (computed) ────────────────────────────────────
  /** Recalcula sozinho quando as despesas OU os filtros mudam. */
  readonly filteredExpenses = computed(() =>
    sortByDateDesc(filterExpenses(this._expenses(), this._filters())),
  );
  readonly filteredTotal = computed(() => sumValues(this.filteredExpenses()));
  readonly hasActiveFilters = computed(() => hasActiveFilters(this._filters()));

  // ─── Derivados do dashboard (computed) ────────────────────────────────────
  // O dashboard se atualiza automaticamente ao criar/editar/excluir, porque
  // tudo aqui depende de `_expenses`. Não existe "refresh" manual.
  readonly count = computed(() => this._expenses().length);
  readonly total = computed(() => sumValues(this._expenses()));
  readonly highest = computed(() => findHighest(this._expenses()));
  readonly average = computed(() => averageValue(this._expenses()));
  readonly totalsByCategory = computed(() => totalsByCategory(this._expenses()));
  readonly totalsByMonth = computed(() => totalsByMonth(this._expenses()));

  constructor() {
    // effect(): caso de uso LEGÍTIMO. Gravar no localStorage é um efeito
    // colateral, porque o localStorage não é um signal. O effect lê
    // `_filters()`, então roda de novo a cada mudança de filtro. Assim, os
    // filtros sobrevivem a um F5.
    effect(() => this.storage.write(FILTERS_STORAGE_KEY, this._filters()));
  }

  // ─── Consultas ─────────────────────────────────────────────────────────────
  /**
   * Busca por id. Lê um signal, então, se for chamada dentro de um
   * `computed()`, cria dependência e o computed reage a mudanças na lista.
   */
  findById(id: string): Expense | null {
    return this._expenses().find((expense) => expense.id === id) ?? null;
  }

  // ─── Ações ─────────────────────────────────────────────────────────────────
  async load(): Promise<void> {
    this._status.set('loading');
    try {
      const expenses = await this.repository.getAll();
      this._expenses.set(expenses);
      this._status.set('loaded');
    } catch (error) {
      console.error('Falha ao carregar despesas.', error);
      this._status.set('error');
    }
  }

  /**
   * Primeiro persiste e só depois altera o estado (atualização pessimista):
   * se o repositório falhar, a tela não mostra algo que não foi salvo.
   * O erro é repassado para a página decidir como avisar o usuário.
   */
  async create(draft: ExpenseDraft): Promise<Expense> {
    const created = await this.repository.create(draft);
    // update() + spread: cria um NOVO array. O signal compara por referência;
    // um `push()` no array atual não seria detectado.
    this._expenses.update((current) => [...current, created]);
    return created;
  }

  async update(expense: Expense): Promise<Expense> {
    const saved = await this.repository.update(expense);
    this._expenses.update((current) =>
      current.map((item) => (item.id === saved.id ? saved : item)),
    );
    return saved;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
    this._expenses.update((current) => current.filter((expense) => expense.id !== id));
  }

  /** Altera só os campos informados, preservando os demais. */
  patchFilters(changes: Partial<ExpenseFilters>): void {
    this._filters.update((current) => ({ ...current, ...changes }));
  }

  clearFilters(): void {
    this._filters.set(EMPTY_FILTERS);
  }

  private restoreFilters(): ExpenseFilters {
    const stored = this.storage.read(FILTERS_STORAGE_KEY);
    return isExpenseFilters(stored) ? stored : EMPTY_FILTERS;
  }
}
