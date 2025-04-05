import { Entity } from '@src/shared/domain/entities/entity';
import { PaginationOutputDto } from '../dto/pagination-output.dto';
import { SearchResult } from '@src/shared/domain/repositories/searchable-repository-contract';

export interface PaginationMapperInterface {
  toOutput<T extends Entity<any>>(
    result: SearchResult<T>,
  ): PaginationOutputDto<T>;
}
