import { Entity } from '@src/shared/domain/entities/entity';
import { SearchResult } from '@src/shared/domain/repositories/searchable-repository-contract';

export class PaginationOutputMapper {
  static toOutput<Item = any>(
    items: Item[],
    result: SearchResult<Entity>,
  ): PaginationOutput<Item> {
    return {
      items,
      totalItems: result.totalItems,
      currentPage: result.currentPage,
      lastPage: result.lastPage,
      perPage: result.perPage,
    };
  }
}

export type PaginationOutput<Item = any> = {
  items: Item[];
  totalItems: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
};
