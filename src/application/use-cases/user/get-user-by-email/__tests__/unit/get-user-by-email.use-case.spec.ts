import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { BcryptjsHashProvider } from '@src/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { GetUserByEmail } from '../../get-user-by-email.use-case';
import { Signup } from '../../../signup/signup.use-case';
import { UserDataBuilder } from '@src/domain/entities/user/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@src/infrastructure/modules/user/database/in-memory/repositories/user-in-memory.repository';

describe('GetUserByEmail unit tests', () => {
  let sut: GetUserByEmail;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new GetUserByEmail(repository);
  });

  it('Should return a user by email', async () => {
    const hashProvider = new BcryptjsHashProvider();
    const signup = new Signup(repository, hashProvider);

    const input = UserDataBuilder({});

    await signup.execute(input);

    const spyGetByEmail = jest.spyOn(repository, 'findByEmail');

    const getUserByEmailOutput = await sut.execute(input.email);

    expect(spyGetByEmail).toHaveBeenCalled();
    expect(getUserByEmailOutput.email).toStrictEqual(input.email);
  });

  it('Should throw error when email not provided', async () => {
    const hashProvider = new BcryptjsHashProvider();
    const signup = new Signup(repository, hashProvider);

    const input = UserDataBuilder({});

    await signup.execute(input);

    expect(sut.execute(null)).rejects.toThrow(
      new BadRequestError('Email não pode ser vazio'),
    );

    expect(sut.execute('')).rejects.toThrow(
      new BadRequestError('Email não pode ser vazio'),
    );
  });

  it('should throw validation error when email is invalid', async () => {
    await expect(sut.execute('invalid-email')).rejects.toThrow(
      new BadRequestError('Email inválido'),
    );
  });

  it('Should throw error when email not provided', async () => {
    expect(sut.execute('notdoundemail@example.com')).rejects.toThrow(
      new BadRequestError('Usuário não encontrado'),
    );
  });
});
