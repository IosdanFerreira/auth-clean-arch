import { ListUsersInput } from '@src/application/use-cases/user/list-users.use-case';
import { SortDirection } from '@src/shared/domain/repositories/searchable-repository-contract';

export class ListUsersDto implements ListUsersInput {
  page: number;
  perPage: number;
  sort: string;
  sortDir: SortDirection;
  filter?: string;
}
