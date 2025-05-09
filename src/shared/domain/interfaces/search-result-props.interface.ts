import { Entity } from '../entities/Entity';
import { SortDirection } from '../types';

export type SearchResultProps<T extends Entity, Filter> = {
  items: T[];
  totalItems: number;
  currentPage: number;
  perPage: number;
  sort: string | null;
  sortDir: SortDirection | null;
  filter: Filter | null;
};
