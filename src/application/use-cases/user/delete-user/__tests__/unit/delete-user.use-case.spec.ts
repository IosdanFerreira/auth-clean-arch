import { DeleteUser } from '../../delete-user.use-case';
import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { UserDataBuilder } from '@src/domain/entities/user/testing/helpers/user-data-builder';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { UserInMemoryRepository } from '@src/infrastructure/modules/user/database/in-memory/repositories/user-in-memory.repository';

describe('Delete user password unit tests', () => {
  let sut: DeleteUser;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new DeleteUser(repository);
  });

  it('Should throw error when ID not provided', async () => {
    const input = {
      id: '',
    };

    await expect(() => sut.execute(input)).rejects.toThrow(
      new NotFoundError('ID do usuário precisa ser informado'),
    );
  });
  it('Should throw error when user not found', async () => {
    const input = {
      id: 'fake-id',
    };

    await expect(() => sut.execute(input)).rejects.toThrow(
      new NotFoundError('Usuário não encontrado'),
    );
  });

  it('Should delete user', async () => {
    const findByIdSpy = jest.spyOn(repository, 'findByID');
    const deleteUserSpy = jest.spyOn(repository, 'delete');
    const input = [new UserEntity(UserDataBuilder({}))];

    repository.items = input;

    expect(repository.items).toHaveLength(1);

    await sut.execute({ id: repository.items[0]._id });

    expect(findByIdSpy).toHaveBeenCalled();
    expect(deleteUserSpy).toHaveBeenCalled();
    expect(repository.items).toHaveLength(0);
  });
});
