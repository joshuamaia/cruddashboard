import { Component, input } from '@angular/core';

/** Moldura com título para os gráficos. O gráfico entra via <ng-content>. */
@Component({
  selector: 'app-chart-card',
  template: `
    <section class="chart-card">
      <header class="chart-card__header">
        <h2 class="chart-card__title">{{ title() }}</h2>
        @if (subtitle(); as subtitle) {
          <p class="chart-card__subtitle">{{ subtitle }}</p>
        }
      </header>
      <ng-content />
    </section>
  `,
  styles: `
    .chart-card {
      height: 100%;
      box-sizing: border-box;
      padding: 20px;
      border-radius: var(--mat-sys-corner-large);
      border: 1px solid var(--mat-sys-outline-variant);
      background: var(--mat-sys-surface-container-lowest);
    }
    .chart-card__header {
      margin-bottom: 16px;
    }
    .chart-card__title {
      margin: 0;
      font: var(--mat-sys-title-medium);
    }
    .chart-card__subtitle {
      margin: 4px 0 0;
      font: var(--mat-sys-body-small);
      color: var(--mat-sys-on-surface-variant);
    }
  `,
})
export class ChartCard {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}
