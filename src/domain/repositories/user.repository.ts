import { UserEntity } from '../entities/user/user.entity';
import { SearchableRepositoryInterface } from '@src/shared/domain/repositories/searchable-repository-contract';
import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
} from '@src/shared/domain/repositories/searchable-repository-contract';

export type Filter = string;

export class SearchParams extends DefaultSearchParams<Filter> {}

export class SearchResults extends DefaultSearchResult<UserEntity, Filter> {}

export interface UserRepository
  extends SearchableRepositoryInterface<
    UserEntity,
    Filter,
    SearchParams,
    SearchResults
  > {
  findByEmail(email: string): Promise<UserEntity>;
  emailExist(email: string): Promise<void>;
}
