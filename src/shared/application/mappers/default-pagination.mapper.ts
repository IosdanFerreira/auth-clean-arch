import {
  PaginationMapperInterface,
  PaginationOutputInterface,
} from '../interfaces';

import { Entity } from '@src/shared/domain/entities/Entity';
import { SearchResult } from '@src/shared/domain/utils';

export class DefaultPaginationMapper implements PaginationMapperInterface {
  static toOutput: any;
  /**
   * Transforma o resultado da busca em uma estrutura de dados para paginação,
   * com informa es de paginação, ordenação e filtro.
   *
   * @param result Resultado da busca.
   * @returns Uma estrutura de dados para paginação.
   */
  toOutput<T extends Entity>(
    result: SearchResult<T>,
  ): PaginationOutputInterface<T> {
    return {
      items: result.items.map((item) => item.toJSON()) as any,
      meta: {
        /**
         * Informa es de paginação.
         */
        pagination: {
          totalItems: result.meta.pagination.totalItems,
          currentPage: result.meta.pagination.currentPage,
          perPage: result.meta.pagination.perPage,
          totalPages: result.meta.pagination.totalPages,
          prevPage: result.meta.pagination.prevPage,
          nextPage: result.meta.pagination.nextPage,
        },
        /**
         * Campo de ordenação utilizado na busca.
         */
        sort: result.meta.sort,
        /**
         * Dire o da ordenação (asc/desc).
         */
        sortDir: result.meta.sortDir,
        /**
         * Filtro aplicado na busca.
         */
        filter: result.meta.filter,
      },
    };
  }
}
