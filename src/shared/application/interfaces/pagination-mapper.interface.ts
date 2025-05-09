import { Entity } from '@src/shared/domain/entities/Entity';
import { PaginationOutputInterface } from './pagination-output.interface';
import { SearchResult } from '@src/shared/domain/utils';

export interface PaginationMapperInterface {
  toOutput<T extends Entity<any>>(
    result: SearchResult<T>,
  ): PaginationOutputInterface<T>;
}
