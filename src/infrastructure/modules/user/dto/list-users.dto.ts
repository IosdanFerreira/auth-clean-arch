import { IsNotEmpty, IsNumber } from 'class-validator';

import { ListUsersInput } from '@src/application/use-cases/user/list-user/list-users.use-case';
import { SortDirection } from '@src/shared/domain/repositories/searchable-repository-contract';

export class ListUsersDto implements ListUsersInput {
  @IsNotEmpty()
  @IsNumber()
  page: number;

  @IsNotEmpty()
  @IsNumber()
  perPage: number;

  @IsNotEmpty()
  @IsNumber()
  sort: string;
  sortDir: SortDirection;
  filter?: string;
}
