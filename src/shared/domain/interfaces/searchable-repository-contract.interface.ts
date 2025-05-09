import { SearchParams, SearchResult } from '../utils';

import { Entity } from '../entities/Entity';
import { RepositoryContractInterface } from './repository-contract.interface';

export interface SearchableRepositoryInterface<
  T extends Entity,
  Filter = string,
  SearchInput = SearchParams<Filter>,
  SearchOutput = SearchResult<T, Filter>,
> extends RepositoryContractInterface<T> {
  sortableFields: string[];
  search(props: SearchInput): Promise<SearchOutput>;
}
