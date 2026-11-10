import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getQuery: vi.fn(),
  requireAuth: vi.fn(),
  useDb: vi.fn(),
}));

vi.mock('h3', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, getQuery: mocks.getQuery };
});

vi.mock('../../utils/session', () => ({ requireAuth: mocks.requireAuth }));
vi.mock('../../utils/db', () => ({ useDb: mocks.useDb }));

import handler from './index.get';

describe('GET /api/products', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getQuery.mockReturnValue({ search: 'shirt', page: '1', limit: '10' });
    mocks.requireAuth.mockResolvedValue({ ok: true, user: { id: 1, role: 'admin' } });
  });

  it('counts only matching products so filtered results under the page limit have one page', async () => {
    const filteredRows = [
      { id: 1, name: 'Blue Shirt', category: 'Apparel', price: '10.00', stock: 2 },
      { id: 2, name: 'White Shirt', category: 'Apparel', price: '12.00', stock: 3 },
      { id: 3, name: 'Black Shirt', category: 'Apparel', price: '14.00', stock: 4 },
    ];
    const whereConditions: unknown[] = [];
    let selectIndex = 0;

    mocks.useDb.mockReturnValue({
      select: () => {
        const queryIndex = selectIndex++;
        const query: Record<string, unknown> = {
          from: () => query,
          where: (condition: unknown) => {
            whereConditions.push(condition);
            return query;
          },
          orderBy: () => query,
          limit: () => query,
          offset: () => Promise.resolve(filteredRows),
        };

        if (queryIndex === 1) {
          query.where = (condition: unknown) => {
            whereConditions.push(condition);
            return Promise.resolve([{ total: 3 }]);
          };
        }

        return query;
      },
      selectDistinct: () => {
        const query: Record<string, unknown> = {
          from: () => query,
          where: () => query,
          orderBy: () => Promise.resolve([{ category: 'Apparel' }]),
        };
        return query;
      },
    });

    const response = await handler({} as never);

    expect(response).toMatchObject({
      success: true,
      data: {
        total: 3,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
    expect(whereConditions[0]).toBe(whereConditions[1]);
  });
});
