import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/** Mensagem centralizada para listas vazias, erros e "não encontrado". */
@Component({
  selector: 'app-empty-state',
  imports: [MatIconModule],
  template: `
    <section class="empty-state">
      <mat-icon class="empty-state__icon">{{ icon() }}</mat-icon>
      <h2 class="empty-state__title">{{ title() }}</h2>
      @if (message(); as message) {
        <p class="empty-state__message">{{ message }}</p>
      }
      <ng-content />
    </section>
  `,
  styleUrl: './empty-state.scss',
})
export class EmptyState {
  readonly icon = input('inbox');
  readonly title = input.required<string>();
  readonly message = input<string>();
}
