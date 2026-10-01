import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/** Card de indicador (KPI). Recebe o valor já formatado. */
@Component({
  selector: 'app-stat-card',
  imports: [MatIconModule],
  template: `
    <article class="stat-card">
      <div class="stat-card__header">
        <span class="stat-card__label">{{ label() }}</span>
        <mat-icon class="stat-card__icon" aria-hidden="true">{{ icon() }}</mat-icon>
      </div>
      <p class="stat-card__value">{{ value() }}</p>
      @if (hint(); as hint) {
        <p class="stat-card__hint">{{ hint }}</p>
      }
    </article>
  `,
  styleUrl: './stat-card.scss',
})
export class StatCard {
  readonly label = input.required<string>();
  /** `string | null` porque os pipes `currency`/`number` podem retornar null. */
  readonly value = input.required<string | null>();
  readonly icon = input('analytics');
  readonly hint = input<string>();
}
