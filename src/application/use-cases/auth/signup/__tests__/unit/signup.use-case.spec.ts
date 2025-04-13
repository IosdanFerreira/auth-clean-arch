import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { BcryptjsHashProvider } from '@src/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { HashProviderInterface } from '@src/shared/application/providers/hash-provider.interface';
import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { Signup } from '../../signup.use-case';
import { UserDataBuilder } from '@src/domain/entities/user/testing/helpers/user-data-builder';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { UserInMemoryRepository } from '@src/infrastructure/modules/user/database/in-memory/repositories/user-in-memory.repository';

describe('Signup unit tests', () => {
  let sut: Signup;
  let repository: UserInMemoryRepository;
  let hashProvider: HashProviderInterface;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new Signup(repository, hashProvider);
  });

  it('Should throw error when email not provider', async () => {
    const input = {
      name: 'test1',
      email: '',
      password: 'Test12!@',
    };

    await expect(sut.execute(input)).rejects.toThrow(
      new BadRequestError('Email não pode ser vazio'),
    );
  });

  it('Should throw error when password not provider', async () => {
    const input = {
      name: 'test1',
      email: 'test1@gmail.com',
      password: '',
    };

    await expect(sut.execute(input)).rejects.toThrow(
      new BadRequestError('Senha não pode ser vazio'),
    );
  });

  it('Should throw error when password is not too strong', async () => {
    const input = {
      name: 'test1',
      email: 'test1@gmail.com',
      password: '12345678',
    };

    await expect(sut.execute(input)).rejects.toThrow(
      new BadRequestError(
        'Senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e símbolos',
      ),
    );
  });

  it('Should throw error when name not provider', async () => {
    const input = {
      name: '',
      email: 'test1@gmail.com',
      password: 'Test12!@',
    };

    await expect(sut.execute(input)).rejects.toThrow(
      new BadRequestError('Nome não pode ser vazio'),
    );
  });

  it('Should not be able to register with same email twice', async () => {
    const input1 = {
      name: 'test1',
      email: 'test1@gmail.com',
      password: 'Test12!@',
    };

    const input2 = {
      name: 'test2',
      email: 'test1@gmail.com',
      password: 'Test123!@',
    };

    jest
      .spyOn(repository, 'findByEmail')
      .mockResolvedValue(new UserEntity(UserDataBuilder(input1)));

    await expect(sut.execute(input2)).rejects.toThrow(
      new NotFoundError(
        'Já existe um usuario cadastrado com esse endereço de email',
      ),
    );
  });

  it('Should register a new user', async () => {
    const input = UserDataBuilder({});

    jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(hashProvider, 'generateHash').mockResolvedValue(input.password);
    jest.spyOn(repository, 'insert').mockResolvedValue();

    const output = await sut.execute(input);

    expect(output.id).toBeDefined();
    expect(output.createdAt).toBeInstanceOf(Date);
    expect(repository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(hashProvider.generateHash).toHaveBeenCalledWith(
      input.password,
      expect.anything(),
    );
    expect(repository.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        name: input.name,
        email: input.email,
        password: input.password,
      }),
    );
  });
});
