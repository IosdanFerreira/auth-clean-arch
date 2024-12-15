import { UserInMemoryRepository } from '@src/infrastructure/repositories/user/in-memory/user-in-memory.repository';
import { Signup } from '../signup.use-case';
import { HashProviderInterface } from '@src/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '@src/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { UserDataBuilder } from '@src/domain/entities/user/testing/helpers/user-data-builder';

describe('Signup unit tests', () => {
  let sut: Signup;
  let repository: UserInMemoryRepository;
  let hashProvider: HashProviderInterface;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new Signup(repository, hashProvider);
  });

  it('Should register a new user', async () => {
    const input = UserDataBuilder({});

    const spyInsert = jest.spyOn(repository, 'insert');

    const output = await sut.execute(input);

    expect(spyInsert).toHaveBeenCalled();
    expect(output.id).toBeDefined();
    expect(output.createdAt).toBeInstanceOf(Date);
  });

  it('Should not be able to register with same email twice', async () => {
    const input = UserDataBuilder({});

    const input2 = UserDataBuilder({});

    await sut.execute(input);

    expect(sut.execute(input2)).rejects.toThrow(
      new NotFoundError('User already exist'),
    );
  });

  it('Should throe error when email not provider', async () => {
    const input = UserDataBuilder({ email: '' });

    expect(sut.execute(input)).rejects.toThrow(
      new BadRequestError('Params not provider'),
    );
  });

  it('Should throe error when password not provider', async () => {
    const input = UserDataBuilder({ password: '' });

    expect(sut.execute(input)).rejects.toThrow(
      new BadRequestError('Params not provider'),
    );
  });

  it('Should throe error when name not provider', async () => {
    const input = UserDataBuilder({ name: '' });

    expect(sut.execute(input)).rejects.toThrow(
      new BadRequestError('Params not provider'),
    );
  });
});
