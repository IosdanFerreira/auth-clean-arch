import { UserInMemoryRepository } from '@src/infrastructure/repositories/user/in-memory/user-in-memory.repository';
import { UserDataBuilder } from '@src/domain/entities/user/testing/helpers/user-data-builder';
import { BcryptjsHashProvider } from '@src/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { GetUserByEmail } from '../../get-user-by-email.use-case';
import { Signup } from '../../signup.use-case';

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
      new BadRequestError('Email not provided'),
    );
  });

  it('Should throw error when email is empty', async () => {
    const hashProvider = new BcryptjsHashProvider();
    const signup = new Signup(repository, hashProvider);

    const input = UserDataBuilder({});

    await signup.execute(input);

    expect(sut.execute('')).rejects.toThrow(
      new BadRequestError('Email not provided'),
    );
  });
});
