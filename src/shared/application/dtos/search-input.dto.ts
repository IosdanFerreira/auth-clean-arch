import { SortDirection } from '@src/shared/domain/repositories/searchable-repository-contract';

export interface SearchInput<Filter = string> {
  page: number;
  perPage: number;
  sort: string | null;
  sortDir: SortDirection | null;
  filter?: Filter | null;
}
