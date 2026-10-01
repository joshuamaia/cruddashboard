import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

export interface ConfirmDialogData {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel?: string;
}

/** Diálogo genérico de confirmação. Fecha com `true` (confirmou) ou `false`. */
@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancelar</button>
      <button mat-flat-button class="button-danger" [mat-dialog-close]="true" cdkFocusInitial>
        {{ data.confirmLabel ?? 'Confirmar' }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialog {
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}

/**
 * Abre o diálogo e converte o resultado (Observable) em Promise<boolean>,
 * para que quem chama possa simplesmente usar `await`.
 */
export async function openConfirmDialog(
  dialog: MatDialog,
  data: ConfirmDialogData,
): Promise<boolean> {
  const ref = dialog.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
    data,
    width: '420px',
  });
  const result = await firstValueFrom(ref.afterClosed());
  return result === true;
}
