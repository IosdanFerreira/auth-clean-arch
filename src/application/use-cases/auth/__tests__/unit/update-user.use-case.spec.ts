import { UserInMemoryRepository } from '@src/infrastructure/repositories/user/in-memory/user-in-memory.repository';
import { UserDataBuilder } from '@src/domain/entities/user/testing/helpers/user-data-builder';
import { UpdateUser } from '../../update-user.use-case';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';

describe('Update User unit tests', () => {
  let sut: UpdateUser;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new UpdateUser(repository);
  });

  it('Should throw error when user not found by ID', async () => {
    await expect(() =>
      sut.execute({ id: 'wrong_id', name: 'test' }),
    ).rejects.toThrow(new NotFoundError('Entity not found'));
  });

  it('Should throw error when name param not provider', async () => {
    const user = new UserEntity(UserDataBuilder({}));

    await repository.insert(user);

    const userExist = await repository.findByID(user._id);

    await expect(() =>
      sut.execute({ id: userExist._id, name: '' }),
    ).rejects.toThrow(new BadRequestError('Name not provided'));
  });

  it('Should update user', async () => {
    const user = new UserEntity(UserDataBuilder({}));

    await repository.insert(user);

    const userExist = await repository.findByID(user._id);

    await sut.execute({ id: userExist._id, name: 'new name' });

    expect(userExist.name).toStrictEqual('new name');
  });
});
