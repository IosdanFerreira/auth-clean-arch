import { UserInMemoryRepository } from '@src/infrastructure/repositories/user/in-memory/user-in-memory.repository';
import { UserDataBuilder } from '@src/domain/entities/user/testing/helpers/user-data-builder';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { UpdatePassword } from '../../update-password.use-case';
import { HashProviderInterface } from '@src/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '@src/infrastructure/providers/hash-provider/bcryptjs-hash.provider';

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
    const createUserInput = new UserEntity(UserDataBuilder({}));

    await repository.insert(createUserInput);

    const user = await repository.findByID(createUserInput._id);

    const updatePasswordInput = {
      id: user._id,
      password: '',
      oldPassword: user.password,
    };

    await expect(() => sut.execute(updatePasswordInput)).rejects.toThrow(
      new BadRequestError('Old password and new password is required'),
    );
  });

  it('Should throw error when old password not provided', async () => {
    const createUserInput = new UserEntity(UserDataBuilder({}));

    await repository.insert(createUserInput);

    const user = await repository.findByID(createUserInput._id);

    const updatePasswordInput = {
      id: user._id,
      password: '12345678',
      oldPassword: '',
    };

    await expect(() => sut.execute(updatePasswordInput)).rejects.toThrow(
      new BadRequestError('Old password and new password is required'),
    );
  });

  it('Should throw error when old password and new password not provided', async () => {
    const createUserInput = new UserEntity(UserDataBuilder({}));

    await repository.insert(createUserInput);

    const user = await repository.findByID(createUserInput._id);

    const updatePasswordInput = {
      id: user._id,
      password: '',
      oldPassword: '',
    };

    await expect(() => sut.execute(updatePasswordInput)).rejects.toThrow(
      new BadRequestError('Old password and new password is required'),
    );
  });
});
