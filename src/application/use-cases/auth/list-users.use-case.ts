import {
  UserSearchParams,
  UserRepository,
  UserSearchResults,
} from '@src/domain/repositories/user.repository';
import { SearchInput } from '@src/shared/application/dtos/search-input.dto';
import { UserOutputDto, UserOutputMapper } from './dto/user-output.dto';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@src/shared/application/dtos/pagination-output.dto';

export class ListUsers {
  constructor(readonly userRepository: UserRepository) {}

  async execute(input: ListUsersInput): Promise<ListUsersOutput> {
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
