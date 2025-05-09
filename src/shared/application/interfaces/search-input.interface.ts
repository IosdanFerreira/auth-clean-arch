import { SortDirection } from '@src/shared/domain/types';

export interface SearchInputInterface<Filter = string> {
  page: number;
  perPage: number;
  sort: string | null;
  sortDir: SortDirection | null;
  filter?: Filter | null;
}
