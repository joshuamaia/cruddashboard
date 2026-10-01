import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MatIconRegistry } from '@angular/material/icon';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { BR_DATE_FORMATS } from '@core/config/date-formats';
import { ExpenseRepository } from '@features/expenses/services/expense.repository';
import { LocalStorageExpenseRepository } from '@features/expenses/services/local-storage-expense.repository';
import { ExpenseStore } from '@features/expenses/state/expense.store';
import { ptBR } from 'date-fns/locale';

import { routes } from './app.routes';

// Dados de formatação do português para os pipes `currency`, `date` e `number`.
registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    // withComponentInputBinding: parâmetros de rota (:id) viram `input()` no componente.
    provideRouter(routes, withComponentInputBinding()),

    // Localização: pipes em pt-BR e DatePicker com date-fns em pt-BR (dd/MM/yyyy).
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideDateFnsAdapter(BR_DATE_FORMATS),
    { provide: MAT_DATE_LOCALE, useValue: ptBR },

    // Ponto ÚNICO de troca da persistência. Para usar uma API REST:
    // { provide: ExpenseRepository, useClass: HttpExpenseRepository }
    { provide: ExpenseRepository, useClass: LocalStorageExpenseRepository },

    provideAppInitializer(() => {
      // Ícones do Material usando a fonte "Material Symbols Outlined".
      inject(MatIconRegistry).setDefaultFontSetClass('material-symbols-outlined');
      // Inicia o carregamento das despesas sem bloquear o bootstrap (sem
      // `return`/`await`): as telas exibem o estado "loading" enquanto isso.
      void inject(ExpenseStore).load();
    }),
  ],
};
