import { BadRequestError, NotFoundError } from '@src/shared/domain/errors';
import {
  UpdatePasswordInput,
  UpdatePasswordUseCase,
} from '../../update-password.use-case';

import { Email } from '@src/shared/domain/value-objects/email/email.value-object';
import { HashProviderInterface } from '@src/shared/application/interfaces';
import { Name } from '@src/shared/domain/value-objects/name/name.value-object';
import { Password } from '@src/shared/domain/value-objects/password/password.value-object';
import { UserEntity } from '@src/modules/user/domain/entity/user.entity';
import { UserRepositoryInterface } from '@src/modules/user/domain/repositories/user.repository';
import { ValidatorStrategyInterface } from '@src/shared/domain/interfaces';

describe('UpdatePassword Use Case', () => {
  let sut: UpdatePasswordUseCase;

  let userRepository: jest.Mocked<UserRepositoryInterface>;
  let hashProvider: jest.Mocked<HashProviderInterface>;
  let validator: jest.Mocked<ValidatorStrategyInterface<UpdatePasswordInput>>;

  let userEntity: UserEntity;
  let input: UpdatePasswordInput;

  beforeEach(() => {
    userEntity = UserEntity.create({
      name: Name.create('John Doe'),
      email: Email.create('test@example.com'),
      password: Password.create('oldPasswordHashed12!@'),
    });

    input = {
      id: userEntity.id,
      oldPassword: 'oldPasswordHashed12!@',
      newPassword: 'newPassword12!@',
    };

    userRepository = {
      findByID: jest.fn(),
      update: jest.fn(),
      insert: jest.fn(),
      delete: jest.fn(),
      findByEmail: jest.fn(),
    } as jest.Mocked<UserRepositoryInterface>;

    hashProvider = {
      compareHash: jest.fn(),
      generateHash: jest.fn(),
    } as jest.Mocked<HashProviderInterface>;

    validator = {
      validate: jest.fn(),
    } as jest.Mocked<ValidatorStrategyInterface<UpdatePasswordInput>>;

    sut = new UpdatePasswordUseCase(userRepository, hashProvider, validator);
  });

  it('should validate the input data', async () => {
    userRepository.findByID.mockResolvedValue(userEntity);
    hashProvider.compareHash.mockResolvedValue(true);
    hashProvider.generateHash.mockResolvedValue('newHashedPassword12!@');

    await sut.execute(input);

    expect(validator.validate).toHaveBeenCalledWith(input);
  });

  it('should throw NotFoundError if user is not found', async () => {
    userRepository.findByID.mockResolvedValue(null);

    await expect(sut.execute(input)).rejects.toThrow(
      new NotFoundError('Erro ao atualizar senha', [
        { property: 'id', message: 'Usuário nao encontrado' },
      ]),
    );
  });

  it('should throw BadRequestError if old password does not match', async () => {
    userRepository.findByID.mockResolvedValue(userEntity);
    hashProvider.compareHash.mockResolvedValue(false);

    await expect(sut.execute(input)).rejects.toThrow(
      new BadRequestError('Erro ao atualizar senha', [
        { property: 'password', message: 'Senha inválida' },
      ]),
    );
  });

  it('should update the user password if old password matches', async () => {
    userRepository.findByID.mockResolvedValue(userEntity);
    hashProvider.compareHash.mockResolvedValue(true);
    hashProvider.generateHash.mockResolvedValue('completelyDifferentHash987!@');

    const result = await sut.execute(input);

    expect(hashProvider.compareHash).toHaveBeenCalledWith(
      input.oldPassword,
      'oldPasswordHashed12!@',
    );

    expect(hashProvider.generateHash).toHaveBeenCalledWith(
      input.newPassword,
      6,
    );

    expect(userRepository.update).toHaveBeenCalledWith(
      userEntity.id,
      userEntity,
    );

    expect(result).toEqual(userEntity.toJSON());
  });
});
