import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { BcryptjsHashProvider } from '@src/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { HashProviderInterface } from '@src/shared/application/providers/hash-provider.interface';
import { JwtProviderInterface } from '@src/shared/application/providers/jwt-provider.interface';
import { NotFoundError } from '@src/shared/domain/errors/not-found-error';
import { Signin } from '../../signin.use-case';
import { UserDataBuilder } from '@src/domain/entities/user/testing/helpers/user-data-builder';
import { UserEntity } from '@src/domain/entities/user/user.entity';
import { UserInMemoryRepository } from '@src/infrastructure/modules/user/database/in-memory/repositories/user-in-memory.repository';

describe('Signin unit tests', () => {
  let sut: Signin;
  let repository: UserInMemoryRepository;
  let hashProvider: HashProviderInterface;
  let jwtProvider: JwtProviderInterface;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new Signin(repository, hashProvider, jwtProvider);
  });

  it('Should throw error when email not provider', async () => {
    const input = {
      email: '',
      password: '12345678',
    };

    expect(sut.execute(input)).rejects.toThrow(
      new BadRequestError('Params not provided'),
    );
  });

  it('Should throw error when password not provider', async () => {
    const input = {
      email: 'test@gmail.com',
      password: '',
    };

    expect(sut.execute(input)).rejects.toThrow(
      new BadRequestError('User not found using test@gmail.com'),
    );
  });

  it('Should throw error when user not found', async () => {
    const input = {
      email: 'test@gmail.com',
      password: '12345678',
    };

    expect(sut.execute(input)).rejects.toThrow(
      new NotFoundError('User not found using test@gmail.com'),
    );
  });

  it('Should throw error when hashPassword no matches', async () => {
    const hashPassword = await hashProvider.generateHash('1234', 6);

    const input = { email: 'test@gmail.com', password: hashPassword };

    const user = [new UserEntity(UserDataBuilder(input))];

    repository.items = user;

    expect(
      sut.execute({ email: 'test@gmail.com', password: '123' }),
    ).rejects.toThrow(new Error('Email ou senha inválidos'));
  });

  it('Should signin user', async () => {
    const findByEmailSpy = jest.spyOn(repository, 'findByEmail');
    const compareHashSpy = jest.spyOn(hashProvider, 'compareHash');

    const hashPassword = await hashProvider.generateHash('1234', 6);

    const items = [
      new UserEntity(
        UserDataBuilder({ email: 'test@gmail.com', password: hashPassword }),
      ),
    ];

    repository.items = items;

    const output = await sut.execute({
      email: 'test@gmail.com',
      password: '1234',
    });

    expect(output).toStrictEqual(items[0].toJson());
    expect(findByEmailSpy).toHaveBeenCalled();
    expect(compareHashSpy).toHaveBeenCalled();
  });
});
