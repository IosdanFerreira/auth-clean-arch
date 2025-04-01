import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { BcryptjsHashProvider } from '@src/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { HashProviderInterface } from '@src/shared/application/providers/hash-provider.interface';
import { UpdatePassword } from '../../update-password.use-case';
import { UserDataBuilder } from '@src/domain/entities/user/testing/helpers/user-data-builder';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { UserInMemoryRepository } from '@src/infrastructure/repositories/user/in-memory/user-in-memory.repository';

describe('Update user password unit tests', () => {
  let sut: UpdatePassword;
  let repository: UserInMemoryRepository;
  let hashProvider: HashProviderInterface;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new UpdatePassword(repository, hashProvider);
  });

  it('Should throw error when new password not provided', async () => {
    const items = [new UserEntity(UserDataBuilder({}))];

    repository.items = items;

    const input = {
      id: repository.items[0]._id,
      password: '',
      oldPassword: repository.items[0].password,
    };

    await expect(() => sut.execute(input)).rejects.toThrow(
      new BadRequestError('Senha inválida'),
    );
  });

  it('Should throw error when old password not provided', async () => {
    const items = [new UserEntity(UserDataBuilder({}))];

    repository.items = items;

    const input = {
      id: repository.items[0]._id,
      password: '12345678',
      oldPassword: '',
    };

    await expect(() => sut.execute(input)).rejects.toThrow(
      new BadRequestError('Senha inválida'),
    );
  });

  it('Should throw error when old password and new password not provided', async () => {
    const items = [new UserEntity(UserDataBuilder({}))];

    repository.items = items;

    const input = {
      id: repository.items[0]._id,
      password: '',
      oldPassword: '',
    };

    await expect(() => sut.execute(input)).rejects.toThrow(
      new BadRequestError('Senha inválida'),
    );
  });
});
