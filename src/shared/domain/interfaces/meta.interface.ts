import { PaginationInterface } from '../../application/interfaces/pagination.interface';
import { SortDirection } from '@src/shared/domain/types';

export interface MetaInterface<Filter = string> {
  pagination: PaginationInterface;
  sort: string | null;
  sortDir: SortDirection;
  filter: Filter | null;
}
