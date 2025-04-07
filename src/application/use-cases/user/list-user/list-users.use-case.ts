import {
  UserRepositoryInterface,
  UserSearchParams,
} from '@src/domain/repositories/user.repository';

import { PaginationMapperInterface } from '@src/shared/application/mappers/pagination-mapper.interface';
import { PaginationOutputDto } from '@src/shared/application/dto/pagination-output.dto';
import { SearchInputDto } from '@src/shared/application/dto/search-input.dto';
import { UserOutputDto } from '../_dto/user-output.dto';
import { ValidatorInterface } from '@src/shared/application/validators/validator.interface';

export class ListUsers {
  constructor(
    readonly userRepository: UserRepositoryInterface,
    private readonly paginationMapper: PaginationMapperInterface,
    private readonly validator: ValidatorInterface<ListUsersInput>,
  ) {}

  async execute(input: ListUsersInput): Promise<ListUsersOutput> {
    this.validator.validate(input);

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
