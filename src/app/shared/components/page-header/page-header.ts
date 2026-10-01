import { Component, input } from '@angular/core';

/**
 * Cabeçalho padrão das páginas.
 * Ações (botões) são projetadas via <ng-content>.
 */
@Component({
  selector: 'app-page-header',
  template: `
    <header class="page-header">
      <div>
        <h1 class="page-header__title">{{ title() }}</h1>
        <!-- "@if (...; as x)" testa o valor e cria uma variável local já sem undefined. -->
        @if (subtitle(); as subtitle) {
          <p class="page-header__subtitle">{{ subtitle }}</p>
        }
      </div>
      <div class="page-header__actions">
        <ng-content />
      </div>
    </header>
  `,
  styleUrl: './page-header.scss',
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}
