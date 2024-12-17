import { UserEntity } from '../entities/user/user.entity';
import { SearchableRepositoryInterface } from '@src/shared/domain/repositories/searchable-repository-contract';
import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
} from '@src/shared/domain/repositories/searchable-repository-contract';

export type Filter = string;

export class UserSearchParams extends DefaultSearchParams<Filter> {}

export class UserSearchResults extends DefaultSearchResult<
  UserEntity,
  Filter
> {}

export interface UserRepository
  extends SearchableRepositoryInterface<
    UserEntity,
    Filter,
    UserSearchParams,
    UserSearchResults
  > {
  findByEmail(email: string): Promise<UserEntity>;
  emailExist(email: string): Promise<void>;
}
