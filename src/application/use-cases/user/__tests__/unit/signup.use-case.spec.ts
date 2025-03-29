import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { BcryptjsHashProvider } from '@src/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { HashProviderInterface } from '@src/shared/application/providers/hash-provider.interface';
import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { Signup } from '../../signup.use-case';
import { UserDataBuilder } from '@src/domain/entities/user/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@src/infrastructure/repositories/user/in-memory/user-in-memory.repository';

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
      password: '12345678',
    };

    expect(sut.execute(input)).rejects.toThrow(
      new BadRequestError('Params not provider'),
    );
  });

  it('Should throe error when password not provider', async () => {
    const input = {
      name: 'test1',
      email: 'test1@gmail.com',
      password: '',
    };

    expect(sut.execute(input)).rejects.toThrow(
      new BadRequestError('Params not provider'),
    );
  });

  it('Should throe error when name not provider', async () => {
    const input = {
      name: '',
      email: 'test1@gmail.com',
      password: '12345678',
    };

    expect(sut.execute(input)).rejects.toThrow(
      new BadRequestError('Params not provider'),
    );
  });

  it('Should not be able to register with same email twice', async () => {
    const input = {
      name: 'test1',
      email: 'test1@gmail.com',
      password: '12345678',
    };

    const input2 = {
      name: 'test2',
      email: 'test1@gmail.com',
      password: '1234567822',
    };

    await sut.execute(input);

    expect(sut.execute(input2)).rejects.toThrow(
      new NotFoundError('User already exist'),
    );
  });

  it('Should register a new user', async () => {
    const input = UserDataBuilder({});

    const emailExistSpy = jest.spyOn(repository, 'emailExist');
    const generateHashSpy = jest.spyOn(hashProvider, 'generateHash');
    const spyInsert = jest.spyOn(repository, 'insert');

    const output = await sut.execute(input);

    expect(emailExistSpy).toHaveBeenCalled();
    expect(generateHashSpy).toHaveBeenCalled();
    expect(spyInsert).toHaveBeenCalled();
    expect(typeof output).toBe('object');
    expect(output.id).toBeDefined();
    expect(output.createdAt).toBeInstanceOf(Date);
  });
});
