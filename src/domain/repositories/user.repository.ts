import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
} from '@src/shared/domain/repositories/searchable-repository-contract';

import { SearchableRepositoryInterface } from '@src/shared/domain/repositories/searchable-repository-contract';
import { UserEntity } from '../entities/user/user.entity';

export type Filter = string;

export class UserSearchParams extends DefaultSearchParams<Filter> {}

export class UserSearchResults extends DefaultSearchResult<
  UserEntity,
  Filter
> {}

export interface UserRepositoryInterface
  extends SearchableRepositoryInterface<
    UserEntity,
    Filter,
    UserSearchParams,
    UserSearchResults
  > {
  findByEmail(email: string): Promise<UserEntity>;
}
