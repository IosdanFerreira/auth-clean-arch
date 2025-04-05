import { PaginationOutputMapper } from '../../standard-pagination.mapper';
import { SearchResult } from '@src/shared/domain/repositories/searchable-repository-contract';

describe('PaginationOutputMapper unit tests', () => {
  it('should convert a SearchResult in output', () => {
    const result = new SearchResult({
      items: ['fake'] as any,
      totalItems: 1,
      currentPage: 1,
      perPage: 1,
      sort: '',
      sortDir: 'asc',
      filter: 'fake',
    });

    const sut = PaginationOutputMapper.toOutput(result);

    expect(sut).toStrictEqual({
      items: ['fake'],
      totalItems: 1,
      currentPage: 1,
      perPage: 1,
    });
  });
});
