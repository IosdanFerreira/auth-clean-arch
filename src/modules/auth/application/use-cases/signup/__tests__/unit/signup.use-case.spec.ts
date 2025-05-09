import { SignUpUseCase, SignupInput } from '../../signup.use-case';

import { ConflictError } from '@src/shared/domain/errors';
import { Email } from '@src/shared/domain/value-objects/email/email.value-object';
import { HashProviderInterface } from '@src/shared/application/interfaces/hash-provider.interface';
import { Name } from '@src/shared/domain/value-objects/name/name.value-object';
import { Password } from '@src/shared/domain/value-objects/password/password.value-object';
import { UserEntity } from '@src/modules/user/domain/entity/user.entity';
import { UserRepositoryInterface } from '@src/modules/user/domain/repositories/user.repository';
import { ValidatorStrategyInterface } from '@src/shared/domain/interfaces';

describe('SignUpUseCase unit tests', () => {
  let sut: SignUpUseCase;

  let userRepository: jest.Mocked<UserRepositoryInterface>;
  let hashProvider: jest.Mocked<HashProviderInterface>;
  let validator: jest.Mocked<ValidatorStrategyInterface<SignupInput>>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByID: jest.fn(),
      findAll: jest.fn(),
      count: jest.fn(),
    } as jest.Mocked<UserRepositoryInterface>;

    hashProvider = {
      compareHash: jest.fn(),
      generateHash: jest.fn(),
    } as jest.Mocked<HashProviderInterface>;

    validator = {
      validate: jest.fn(),
    } as jest.Mocked<ValidatorStrategyInterface<SignupInput>>;

    sut = new SignUpUseCase(userRepository, hashProvider, validator);
  });

  const input: SignupInput = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Validpass12!@',
  };

  const passwordHashed =
    '$2a$12$LgDhnbbTjxFQAjb1TKMNDuBcdMeF6xeY4Zc3o6sDcOXNWBKiYXH3u';

  const user = UserEntity.create({
    name: Name.create(input.name),
    email: Email.create(input.email),
    password: Password.create(passwordHashed),
  });

  it('should validate the input', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    hashProvider.generateHash.mockResolvedValue(passwordHashed);

    userRepository.insert.mockResolvedValue(undefined);
    jest.spyOn(UserEntity, 'create').mockReturnValue(user);

    await sut.execute(input);

    expect(validator.validate).toHaveBeenCalledWith(input);
  });

  it('should throw error if email already exists', async () => {
    userRepository.findByEmail.mockResolvedValue(user);

    await expect(sut.execute(input)).rejects.toThrow(
      new ConflictError('Erro ao cadastrar novo usuário'),
    );
    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
  });

  it('should hash the password and insert the user', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    hashProvider.generateHash.mockResolvedValue(passwordHashed);

    jest.spyOn(UserEntity, 'create').mockReturnValue(user);
    userRepository.insert.mockResolvedValue(undefined);

    const result = await sut.execute(input);

    expect(hashProvider.generateHash).toHaveBeenCalledWith(input.password, 6);
    expect(userRepository.insert).toHaveBeenCalledWith(user);
    expect(result).toEqual(user.toJSON());
  });

  it('should return user data as output', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    hashProvider.generateHash.mockResolvedValue(passwordHashed);

    jest.spyOn(UserEntity, 'create').mockReturnValue(user);
    userRepository.insert.mockResolvedValue(undefined);

    const output = await sut.execute(input);

    expect(output).toEqual(user.toJSON());
  });

  it('should throw an error if hashProvider.generateHash fails', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    hashProvider.generateHash.mockRejectedValue(new Error('Hash error'));

    await expect(sut.execute(input)).rejects.toThrow('Hash error');
    expect(hashProvider.generateHash).toHaveBeenCalledWith(input.password, 6);
  });
});
