import { InMemorySearchableRepository } from '@src/shared/domain/repositories/in-memory-searchable.repository';
import { SortDirection } from '@src/shared/domain/repositories/searchable-repository-contract';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { UserRepositoryInterface } from '@src/domain/repositories/user.repository';

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepositoryInterface
{
  sortableFields: string[] = ['name', 'createdAt'];

  async findByEmail(email: string): Promise<UserEntity> {
    const entity = this.items.find((item) => item.email === email);
    return entity;
  }

  protected async applyFilter(
    items: UserEntity[],
    filter: string,
  ): Promise<UserEntity[]> {
    if (!filter) {
      return items;
    }
    return items.filter((item) => {
      return item.props.name.toLowerCase().includes(filter.toLowerCase());
    });
  }

  protected async applySort(
    items: UserEntity[],
    sort: string | null,
    sortDir: SortDirection | null,
  ): Promise<UserEntity[]> {
    return !sort
      ? super.applySort(items, 'createdAt', 'desc')
      : super.applySort(items, sort, sortDir);
  }
}
