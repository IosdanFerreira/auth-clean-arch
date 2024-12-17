import { UserEntity } from '@src/domain/entities/user/user.entity';
import {
  Filter,
  UserRepository,
} from '@src/domain/repositories/user.repository';
import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { InMemorySearchableRepository } from '@src/shared/domain/repositories/in-memory-searchable.repository';
import { SortDirection } from '@src/shared/domain/repositories/searchable-repository-contract';

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepository
{
  sortableFields: string[] = ['name', 'createdAt'];

  async findByEmail(email: string): Promise<UserEntity> {
    const foundedUser = this.items.find((user) => user.email === email);

    if (!foundedUser) {
      throw new NotFoundError(`User not found using ${email}`);
    }

    return foundedUser;
  }

  async findById(id: string): Promise<UserEntity> {
    const foundedUser = this.items.find((user) => user.id === id);

    if (!foundedUser) {
      throw new NotFoundError(`User not found using ${id}`);
    }

    return foundedUser;
  }

  // Checa se o email existe na base de dados, se existir, não deve criar um novo usuário com o mesmo email
  async emailExist(email: string): Promise<void> {
    const foundedUser = this.items.find((user) => user.email === email);

    if (foundedUser) {
      throw new NotFoundError('User already exist');
    }
  }

  protected async applyFilter(
    items: UserEntity[],
    filter: Filter,
  ): Promise<UserEntity[]> {
    if (!filter) {
      return items;
    }

    return items.filter((items) => {
      return items.props.name
        .toLocaleLowerCase()
        .includes(filter.toLocaleLowerCase());
    });
  }

  protected applySort(
    items: UserEntity[],
    sort: string | null,
    sortDir: SortDirection | null,
  ): Promise<UserEntity[]> {
    return !sort
      ? super.applySort(items, 'createdAt', 'desc')
      : super.applySort(items, sort, sortDir);
  }
}
