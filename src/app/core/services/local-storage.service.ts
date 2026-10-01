import { Injectable } from '@angular/core';

/**
 * Acesso centralizado e seguro ao `localStorage`.
 *
 * - Serializa/desserializa JSON.
 * - Nunca lança exceção: cota excedida, modo privado ou JSON corrompido
 *   são tratados aqui, em um único lugar.
 * - `read()` devolve `unknown` de propósito: quem lê é obrigado a validar
 *   o formato (type guard) antes de usar o dado. Nada de `any`.
 */
@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  read(key: string): unknown {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? null : (JSON.parse(raw) as unknown);
    } catch {
      return null;
    }
  }

  write(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Não foi possível gravar "${key}" no localStorage.`, error);
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage indisponível: não há o que remover.
    }
  }
}
