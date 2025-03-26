import { ConflictError } from '@src/shared/domain/errors/conflict-error';
import { InMemorySearchableRepository } from '@src/shared/domain/repositories/in-memory-searchable.repository';
import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { SortDirection } from '@src/shared/domain/repositories/searchable-repository-contract';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { UserRepository } from '@src/domain/repositories/user.repository';

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepository
{
  sortableFields: string[] = ['name', 'createdAt'];

  async findByEmail(email: string): Promise<UserEntity> {
    const entity = this.items.find((item) => item.email === email);
    if (!entity) {
      throw new NotFoundError(`Entity not found using email ${email}`);
    }
    return entity;
  }

  async emailExist(email: string): Promise<void> {
    const entity = this.items.find((item) => item.email === email);
    if (entity) {
      throw new ConflictError('Email address already used');
    }
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
