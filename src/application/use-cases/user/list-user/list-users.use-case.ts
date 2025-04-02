import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@src/shared/application/dtos/pagination-output.dto';
import { UserOutputDto, UserOutputMapper } from '../dto/user-output.dto';
import {
  UserRepositoryInterface,
  UserSearchParams,
  UserSearchResults,
} from '@src/domain/repositories/user.repository';

import { ListUsersValidator } from './validator/list-user.validator';
import { SearchInput } from '@src/shared/application/dtos/search-input.dto';

export class ListUsers {
  constructor(readonly userRepository: UserRepositoryInterface) {}

  async execute(input: ListUsersInput): Promise<ListUsersOutput> {
    const validator = new ListUsersValidator();

    validator.validate(input as any);

    const searchParams = new UserSearchParams(input);

    const listedUsers = await this.userRepository.search(searchParams);

    return this.toOutput(listedUsers);
  }

  private toOutput(searchResult: UserSearchResults): ListUsersOutput {
    const items = searchResult.items.map((item) => {
      return UserOutputMapper.toOutput(item);
    });

    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}

export type ListUsersInput = SearchInput;

export type ListUsersOutput = PaginationOutput<UserOutputDto>;
