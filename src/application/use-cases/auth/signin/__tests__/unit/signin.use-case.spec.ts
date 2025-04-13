import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { BcryptjsHashProvider } from '@src/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { HashProviderInterface } from '@src/shared/application/providers/hash-provider.interface';
import { JwtProvider } from '@src/infrastructure/providers/jwt-provider/jwt.provider';
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
    jwtProvider = new JwtProvider({} as any);
    sut = new Signin(repository, hashProvider, jwtProvider);
  });

  it('Should throw error when email not provider', async () => {
    const input = {
      email: '',
      password: '12345678',
    };

    expect(sut.execute(input)).rejects.toThrow(
      new BadRequestError('Email não pode ser vazio'),
    );
  });

  it('Should throw error when password not provider', async () => {
    const input = {
      email: 'test@gmail.com',
      password: '',
    };

    expect(sut.execute(input)).rejects.toThrow(
      new BadRequestError('Senha não pode ser vazio'),
    );
  });

  it('Should throw error when user not found', async () => {
    const input = {
      email: 'test@gmail.com',
      password: '12345678',
    };

    expect(sut.execute(input)).rejects.toThrow(
      new NotFoundError('Email ou senha inválidos'),
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

  it('Should sign in user successfully', async () => {
    const findByEmailSpy = jest.spyOn(repository, 'findByEmail');
    const compareHashSpy = jest.spyOn(hashProvider, 'compareHash');
    const generateTokenSpy = jest
      .spyOn(jwtProvider, 'generateToken')
      .mockResolvedValue('mocked_access_token');

    const email = 'test@gmail.com';
    const password = '1234';
    const hashedPassword = await hashProvider.generateHash(password, 6);

    const userEntity = new UserEntity(
      UserDataBuilder({ email, password: hashedPassword }),
    );

    repository.items = [userEntity];

    const output = await sut.execute({ email, password });

    expect(findByEmailSpy).toHaveBeenCalledWith(email);
    expect(compareHashSpy).toHaveBeenCalledWith(password, hashedPassword);
    expect(generateTokenSpy).toHaveBeenCalledWith({
      sub: userEntity.id,
      email: userEntity.email,
    });

    expect(findByEmailSpy).toHaveBeenCalledTimes(1);
    expect(compareHashSpy).toHaveBeenCalledTimes(1);
    expect(generateTokenSpy).toHaveBeenCalledTimes(1);

    expect(output).toEqual({
      ...userEntity.toJson(),
      accessToken: expect.any(String),
    });
  });

  it('Should not sign in with incorrect password', async () => {
    jest.spyOn(repository, 'findByEmail');
    jest.spyOn(hashProvider, 'compareHash').mockResolvedValueOnce(false);

    const email = 'test@gmail.com';
    const password = 'wrong_password';
    const hashedPassword = await hashProvider.generateHash('1234', 6);

    repository.items = [
      new UserEntity(UserDataBuilder({ email, password: hashedPassword })),
    ];

    await expect(sut.execute({ email, password })).rejects.toThrow(
      'Email ou senha inválidos',
    );
  });

  it('Should not sign in if user does not exist', async () => {
    jest.spyOn(repository, 'findByEmail').mockResolvedValueOnce(null);

    await expect(
      sut.execute({ email: 'notfound@gmail.com', password: '1234' }),
    ).rejects.toThrow('Email ou senha inválidos');
  });
});
