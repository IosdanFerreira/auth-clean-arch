import { Entity } from '@src/shared/domain/entities/entity';
import { PaginationMapperInterface } from './pagination-mapper.interface';
import { PaginationOutputDto } from '../dto/pagination-output.dto';
import { SearchResult } from '@src/shared/domain/repositories/searchable-repository-contract';

export class StandardPaginationMapper implements PaginationMapperInterface {
  static toOutput: any;
  toOutput<T extends Entity>(result: SearchResult<T>): PaginationOutputDto<T> {
    return {
      items: result.items.map((item) => item.toJSON()),
      meta: {
        pagination: {
          totalItems: result.meta.pagination.totalItems,
          currentPage: result.meta.pagination.currentPage,
          perPage: result.meta.pagination.perPage,
          totalPages: result.meta.pagination.totalPages,
          prevPage: result.meta.pagination.prevPage,
          nextPage: result.meta.pagination.nextPage,
        },
        sort: result.meta.sort,
        sortDir: result.meta.sortDir,
        filter: result.meta.filter,
      },
    };
  }
}
