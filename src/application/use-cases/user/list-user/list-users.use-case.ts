import {
  UserRepositoryInterface,
  UserSearchParams,
} from '@src/domain/repositories/user.repository';

import { ListUsersValidator } from './validator/list-user.validator';
import { PaginationMapperInterface } from '@src/shared/application/mappers/pagination-mapper.interface';
import { PaginationOutputDto } from '@src/shared/application/dto/pagination-output.dto';
import { SearchInputDto } from '@src/shared/application/dto/search-input.dto';
import { UserOutputDto } from '../dto/user-output.dto';

export class ListUsers {
  constructor(
    readonly userRepository: UserRepositoryInterface,
    private readonly paginationMapper: PaginationMapperInterface,
  ) {}

  async execute(input: ListUsersInput): Promise<ListUsersOutput> {
    const validator = new ListUsersValidator();

    validator.validate(input as any);

    const searchParams = new UserSearchParams({
      page: input.page,
      perPage: input.perPage,
      sort: input.sort,
      sortDir: input.sortDir,
      filter: input.filter,
    });

    const listedUsers = await this.userRepository.search(searchParams);

    return this.paginationMapper.toOutput(listedUsers);
  }
}

export type ListUsersInput = SearchInputDto;

export type ListUsersOutput = PaginationOutputDto<UserOutputDto>;
