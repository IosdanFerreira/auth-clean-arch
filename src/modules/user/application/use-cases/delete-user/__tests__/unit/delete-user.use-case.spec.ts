import { BadRequestError, NotFoundError } from '@src/shared/domain/errors';
import { DeleteUserInput, DeleteUserUseCase } from '../../delete-user.use-case';

import { Email } from '@src/shared/domain/value-objects/email/email.value-object';
import { Name } from '@src/shared/domain/value-objects/name/name.value-object';
import { Password } from '@src/shared/domain/value-objects/password/password.value-object';
import { UserEntity } from '@src/modules/user/domain/entity/user.entity';
import { UserRepositoryInterface } from '@src/modules/user/domain/repositories/user.repository';

describe('DeleteUserUseCase unit tests', () => {
  let sut: DeleteUserUseCase;
  let userRepository: jest.Mocked<UserRepositoryInterface>;

  const userEntity = UserEntity.create({
    name: Name.create('Jane Doe'),
    email: Email.create('jane@example.com'),
    password: Password.create('SecurePass123!'),
  });

  const input: DeleteUserInput = {
    id: userEntity.id,
  };

  beforeEach(() => {
    userRepository = {
      findByID: jest.fn(),
      update: jest.fn(),
      insert: jest.fn(),
      delete: jest.fn(),
      findByEmail: jest.fn(),
    } as jest.Mocked<UserRepositoryInterface>;

    sut = new DeleteUserUseCase(userRepository);
  });

  it('should throw BadRequestError if no ID is provided', async () => {
    // Arrange
    const invalidInput = { id: '' };

    // Act & Assert
    await expect(sut.execute(invalidInput)).rejects.toThrow(
      new BadRequestError('Erro ao deletar usuário', [
        { property: 'id', message: 'ID do usuário precisa ser informado' },
      ]),
    );
  });

  it('should throw NotFoundError if user does not exist', async () => {
    // Arrange
    userRepository.findByID.mockResolvedValue(null);

    // Act & Assert
    await expect(sut.execute(input)).rejects.toThrow(
      new NotFoundError('Erro ao excluir usuário', [
        { property: 'id', message: 'Usuário não encontrado' },
      ]),
    );
  });

  it('should delete the user if ID is valid and user exists', async () => {
    // Arrange
    userRepository.findByID.mockResolvedValue(userEntity);

    // Act
    await sut.execute(input);

    // Assert
    expect(userRepository.findByID).toHaveBeenCalledWith(input.id);
    expect(userRepository.delete).toHaveBeenCalledWith(input.id);
  });
});
