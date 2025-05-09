import { UpdateUserInput, UpdateUserUseCase } from '../../update-user.use-case';

import { Email } from '@src/shared/domain/value-objects/email/email.value-object';
import { Name } from '@src/shared/domain/value-objects/name/name.value-object';
import { NotFoundError } from '@src/shared/domain/errors';
import { Password } from '@src/shared/domain/value-objects/password/password.value-object';
import { UserEntity } from '@src/modules/user/domain/entity/user.entity';
import { UserRepositoryInterface } from '@src/modules/user/domain/repositories/user.repository';
import { ValidatorStrategyInterface } from '@src/shared/domain/interfaces';

describe('UpdateUserUseCase unit tests', () => {
  let sut: UpdateUserUseCase;

  let userRepository: jest.Mocked<UserRepositoryInterface>;
  let validator: jest.Mocked<ValidatorStrategyInterface<UpdateUserInput>>;

  beforeEach(() => {
    userRepository = {
      findByID: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByEmail: jest.fn(),
      insert: jest.fn(),
    } as jest.Mocked<UserRepositoryInterface>;

    validator = {
      validate: jest.fn(),
    } as jest.Mocked<ValidatorStrategyInterface<UpdateUserInput>>;

    sut = new UpdateUserUseCase(userRepository, validator);
  });

  const userEntity = UserEntity.create({
    name: Name.create('John Doe'),
    email: Email.create('example@example.com'),
    password: Password.create('Password123!'),
  });

  const input: UpdateUserInput = {
    id: userEntity.id,
    name: 'Updated Name',
    email: 'updated@example.com',
  };

  it('should validate the input data', async () => {
    validator.validate.mockImplementation(() => {});

    userRepository.findByID.mockResolvedValue(userEntity);

    await sut.execute(input);

    expect(validator.validate).toHaveBeenCalledWith(input);
  });

  it('should throw NotFoundError if user is not found', async () => {
    userRepository.findByID.mockResolvedValue(null);

    await expect(sut.execute(input)).rejects.toThrow(
      new NotFoundError('Erro ao atualizar usuário', [
        { property: 'id', message: 'Usuário nao encontrado' },
      ]),
    );
    expect(userRepository.findByID).toHaveBeenCalledWith(input.id);
  });

  it('should update the user with the new data', async () => {
    validator.validate.mockImplementation(() => {});
    userRepository.findByID.mockResolvedValue(userEntity);
    userRepository.update.mockResolvedValue(undefined);

    const updateUserSpy = jest.spyOn(userEntity, 'updateUser');

    const result = await sut.execute(input);

    expect(updateUserSpy).toHaveBeenCalledWith({
      name: Name.create(input.name),
      email: Email.create(input.email),
    });

    expect(userRepository.update).toHaveBeenCalledWith(input.id, userEntity);

    expect(result).toEqual({
      id: userEntity.id,
      name: 'Updated Name',
      email: 'updated@example.com',
      password: userEntity.password,
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt,
    });
  });

  it('should call findByID with the correct parameters', async () => {
    userRepository.findByID.mockResolvedValue(userEntity);

    await sut.execute(input);

    expect(userRepository.findByID).toHaveBeenCalledWith(input.id);
  });
});
