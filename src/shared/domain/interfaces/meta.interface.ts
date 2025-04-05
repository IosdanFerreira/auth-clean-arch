import { PaginationInterface } from './pagination.interface';
import { SortDirection } from '../repositories/searchable-repository-contract';

export interface MetaInterface<Filter = string> {
  pagination: PaginationInterface;
  sort: string | null;
  sortDir: SortDirection;
  filter: Filter | null;
}
