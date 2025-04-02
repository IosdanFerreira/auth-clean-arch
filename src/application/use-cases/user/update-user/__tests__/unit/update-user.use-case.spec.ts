import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { UpdateUser } from '../../update-user.use-case';
import { UserDataBuilder } from '@src/domain/entities/user/testing/helpers/user-data-builder';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { UserInMemoryRepository } from '@src/infrastructure/modules/user/database/in-memory/repositories/user-in-memory.repository';

describe('Update User unit tests', () => {
  let sut: UpdateUser;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new UpdateUser(repository);
  });

  it('Should throw error when user not found by ID', async () => {
    const input = { id: 'wrong_id', name: 'test' };

    await expect(() => sut.execute(input)).rejects.toThrow(
      new NotFoundError('Nenhum usuário com o ID informado foi encontrado'),
    );
  });

  it('Should throw error when name param not provider', async () => {
    const user = [new UserEntity(UserDataBuilder({}))];
    repository.items = user;

    const input = {
      id: repository.items[0]._id,
      name: '',
    };

    await expect(() => sut.execute(input)).rejects.toThrow(
      new BadRequestError('Nome não pode ser vazio'),
    );
  });

  it('Should update user', async () => {
    const findBySpy = jest.spyOn(repository, 'findByID');
    const updateSpy = jest.spyOn(repository, 'update');
    const items = [new UserEntity(UserDataBuilder({}))];

    repository.items = items;

    const input = {
      id: repository.items[0]._id,
      name: 'new name',
    };

    const output = await sut.execute(input);

    expect(findBySpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(repository.items[0].name).toStrictEqual('new name');
    expect(typeof output).toBe('object');
  });
});
