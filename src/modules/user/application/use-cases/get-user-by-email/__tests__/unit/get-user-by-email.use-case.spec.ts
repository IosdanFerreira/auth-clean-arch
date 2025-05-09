import { Email } from '@src/shared/domain/value-objects/email/email.value-object';
import { GetUserByEmailUseCase } from '../../get-user-by-email.use-case';
import { Name } from '@src/shared/domain/value-objects/name/name.value-object';
import { NotFoundError } from '@src/shared/domain/errors';
import { Password } from '@src/shared/domain/value-objects/password/password.value-object';
import { UserEntity } from '@src/modules/user/domain/entity/user.entity';
import { UserRepositoryInterface } from '@src/modules/user/domain/repositories/user.repository';
import { ValidatorStrategyInterface } from '@src/shared/domain/interfaces';

describe('GetUserByEmail Use Case', () => {
  let sut: GetUserByEmailUseCase;
  let userRepository: jest.Mocked<UserRepositoryInterface>;
  let validator: jest.Mocked<ValidatorStrategyInterface<{ email: string }>>;

  const validEmail = 'johndoe@example.com';
  const userEntity = UserEntity.create({
    name: Name.create('John Doe'),
    email: Email.create(validEmail),
    password: Password.create('SecurePass123!'),
  });

  beforeEach(() => {
    userRepository = {
      findByID: jest.fn(),
      update: jest.fn(),
      insert: jest.fn(),
      delete: jest.fn(),
      findByEmail: jest.fn(),
    } as jest.Mocked<UserRepositoryInterface>;

    validator = {
      validate: jest.fn(),
    } as jest.Mocked<ValidatorStrategyInterface<{ email: string }>>;

    sut = new GetUserByEmailUseCase(userRepository, validator);
  });

  it('should validate the email input', async () => {
    // Arrange
    userRepository.findByEmail.mockResolvedValue(userEntity);

    // Act
    await sut.execute(validEmail);

    // Assert
    expect(validator.validate).toHaveBeenCalledWith({ email: validEmail });
  });

  it('should return the user if found by email', async () => {
    // Arrange
    userRepository.findByEmail.mockResolvedValue(userEntity);

    // Act
    const result = await sut.execute(validEmail);

    // Assert
    expect(userRepository.findByEmail).toHaveBeenCalledWith(validEmail);
    expect(result).toEqual(userEntity.toJSON());
  });

  it('should throw NotFoundError if user is not found', async () => {
    // Arrange
    userRepository.findByEmail.mockResolvedValue(null);

    // Act & Assert
    await expect(sut.execute(validEmail)).rejects.toThrow(
      new NotFoundError('Erro ao encontrar usuário', [
        { property: 'email', message: 'Usuário nao encontrado' },
      ]),
    );
  });
});
