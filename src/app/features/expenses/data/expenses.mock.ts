import { Expense } from '../models/expense.model';

/**
 * Dados iniciais (seed). São gravados no localStorage no primeiro acesso,
 * quando ainda não existe nada salvo. Cobrem 6 meses e todas as categorias,
 * para que o dashboard e os gráficos já tenham conteúdo interessante.
 */
export const MOCK_EXPENSES: readonly Expense[] = [
  { id: 'exp-001', description: 'Aluguel', category: 'MORADIA', value: 1800, date: '2026-04-05', type: 'FIXA' },
  { id: 'exp-002', description: 'Mensalidade da faculdade', category: 'EDUCACAO', value: 890, date: '2026-04-10', type: 'FIXA' },
  { id: 'exp-003', description: 'Supermercado do mês', category: 'ALIMENTACAO', value: 642.3, date: '2026-04-12', type: 'VARIAVEL' },
  { id: 'exp-004', description: 'Combustível', category: 'TRANSPORTE', value: 280, date: '2026-04-18', type: 'VARIAVEL' },

  { id: 'exp-005', description: 'Aluguel', category: 'MORADIA', value: 1800, date: '2026-05-05', type: 'FIXA' },
  { id: 'exp-006', description: 'Plano de saúde', category: 'SAUDE', value: 450, date: '2026-05-08', type: 'FIXA' },
  { id: 'exp-007', description: 'Supermercado do mês', category: 'ALIMENTACAO', value: 598.9, date: '2026-05-14', type: 'VARIAVEL' },
  { id: 'exp-008', description: 'Cinema e jantar', category: 'LAZER', value: 186.5, date: '2026-05-17', type: 'VARIAVEL' },

  { id: 'exp-009', description: 'Aluguel', category: 'MORADIA', value: 1800, date: '2026-06-05', type: 'FIXA' },
  { id: 'exp-010', description: 'Conta de luz', category: 'MORADIA', value: 214.75, date: '2026-06-11', type: 'VARIAVEL' },
  { id: 'exp-011', description: 'Consulta odontológica', category: 'SAUDE', value: 320, date: '2026-06-20', type: 'VARIAVEL' },
  { id: 'exp-012', description: 'Corridas de aplicativo', category: 'TRANSPORTE', value: 96.4, date: '2026-06-22', type: 'VARIAVEL' },

  { id: 'exp-013', description: 'Curso online de Angular', category: 'EDUCACAO', value: 249.9, date: '2026-07-03', type: 'VARIAVEL' },
  { id: 'exp-014', description: 'Aluguel', category: 'MORADIA', value: 1800, date: '2026-07-05', type: 'FIXA' },
  { id: 'exp-015', description: 'Viagem de férias', category: 'LAZER', value: 2350, date: '2026-07-19', type: 'VARIAVEL' },
  { id: 'exp-016', description: 'Presente de aniversário', category: 'OUTROS', value: 150, date: '2026-07-25', type: 'VARIAVEL' },

  { id: 'exp-017', description: 'Aluguel', category: 'MORADIA', value: 1800, date: '2026-08-05', type: 'FIXA' },
  { id: 'exp-018', description: 'Supermercado do mês', category: 'ALIMENTACAO', value: 711.2, date: '2026-08-09', type: 'VARIAVEL' },
  { id: 'exp-019', description: 'Manutenção do carro', category: 'TRANSPORTE', value: 780, date: '2026-08-21', type: 'VARIAVEL' },
  { id: 'exp-020', description: 'Farmácia', category: 'SAUDE', value: 87.35, date: '2026-08-27', type: 'VARIAVEL' },

  { id: 'exp-021', description: 'Aluguel', category: 'MORADIA', value: 1800, date: '2026-09-05', type: 'FIXA' },
  { id: 'exp-022', description: 'Internet fibra', category: 'MORADIA', value: 119.9, date: '2026-09-10', type: 'FIXA' },
  { id: 'exp-023', description: 'Restaurante japonês', category: 'ALIMENTACAO', value: 132.8, date: '2026-09-13', type: 'VARIAVEL' },
  { id: 'exp-024', description: 'Assinatura de streaming', category: 'LAZER', value: 55.9, date: '2026-09-15', type: 'FIXA' },
  { id: 'exp-025', description: 'Doação', category: 'OUTROS', value: 100, date: '2026-09-28', type: 'VARIAVEL' },
];
