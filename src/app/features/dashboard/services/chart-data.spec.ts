import { CATEGORY_META } from '@features/expenses/models/expense-display';
import { toCategoryBarData, toCategoryDoughnutData, toMonthlyLineData } from './chart-data';

describe('chart-data mappers', () => {
  const totals = [
    { category: 'MORADIA', total: 1800 },
    { category: 'LAZER', total: 300 },
  ] as const;

  it('maps category totals to doughnut data with each category color', () => {
    const data = toCategoryDoughnutData(totals);

    expect(data.labels).toEqual(['Moradia', 'Lazer']);
    expect(data.datasets[0].data).toEqual([1800, 300]);
    expect(data.datasets[0].backgroundColor).toEqual([
      CATEGORY_META.MORADIA.color,
      CATEGORY_META.LAZER.color,
    ]);
  });

  it('keeps the color attached to the category, not to the position', () => {
    const reversed = toCategoryBarData([...totals].reverse());
    expect(reversed.datasets[0].backgroundColor).toEqual([
      CATEGORY_META.LAZER.color,
      CATEGORY_META.MORADIA.color,
    ]);
  });

  it('maps monthly totals to line data with pt-BR month labels', () => {
    const data = toMonthlyLineData([
      { month: '2026-08', total: 100 },
      { month: '2026-09', total: 250 },
    ]);

    expect(data.labels).toEqual(['ago/26', 'set/26']);
    expect(data.datasets[0].data).toEqual([100, 250]);
  });
});
