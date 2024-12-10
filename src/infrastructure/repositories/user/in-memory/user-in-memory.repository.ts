import { UserEntity } from '@src/domain/entities/user/user.entity';
import { UserRepository } from '@src/domain/repositories/user.repository';
import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { InMemorySearchableRepository } from '@src/shared/domain/repositories/in-memory-searchable.repository';

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepository
{
  async findByEmail(email: string): Promise<UserEntity> {
    const foundedUser = this.items.find((user) => user.email === email);

    if (!foundedUser) {
      throw new NotFoundError(`User not found using ${email}`);
    }

    return foundedUser;
  }

  async emailExist(email: string): Promise<void> {
    const foundedUser = this.items.find((user) => user.email === email);

    if (foundedUser) {
      throw new NotFoundError('User already exist');
    }
  }
}
