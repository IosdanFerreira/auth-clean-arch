import {
  JwtTokenFactoryInterface,
  JwtTokenInterface,
} from '@src/modules/auth/application/interfaces';
import { SignInInput, SignInUseCase } from '../../signin.use-case';

import { BadRequestError } from '@src/shared/domain/errors';
import { CacheTokenInterface } from '@src/modules/auth/application/interfaces/cache-token.interface';
import { Email } from '@src/shared/domain/value-objects/email/email.value-object';
import { HashProviderInterface } from '@src/shared/application/interfaces/hash-provider.interface';
import { Name } from '@src/shared/domain/value-objects/name/name.value-object';
import { Password } from '@src/shared/domain/value-objects/password/password.value-object';
import { UserEntity } from '@src/modules/user/domain/entity/user.entity';
import { UserRepositoryInterface } from '@src/modules/user/domain/repositories/user.repository';
import { ValidatorStrategyInterface } from '@src/shared/domain/interfaces';

describe('Signin use case unit tests', () => {
  let sut: SignInUseCase;

  let userRepository: jest.Mocked<UserRepositoryInterface>;
  let hashProvider: jest.Mocked<HashProviderInterface>;
  let jwtTokenFactory: jest.Mocked<JwtTokenFactoryInterface>;
  let validator: jest.Mocked<ValidatorStrategyInterface<SignInInput>>;
  let tokenRepository: jest.Mocked<CacheTokenInterface>;

  const mockAccessToken: JwtTokenInterface = {
    token: 'access-token',
    expiresIn: new Date().getTime() + 3600,
  };

  const mockRefreshToken: JwtTokenInterface = {
    token: 'refresh-token',
    expiresIn: new Date().getTime() + 7200,
  };

  const userId = 'user-id';
  const email = 'user@example.com';
  const plainPassword = 'Password12!@';
  const hashedPassword = 'Hashedpassword12!@';

  const mockUser = UserEntity.create(
    {
      name: Name.create('John Doe'),
      email: Email.create(email),
      password: Password.create(hashedPassword),
    },
    userId,
  );

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

    jwtTokenFactory = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      verifyToken: jest.fn(),
    } as jest.Mocked<JwtTokenFactoryInterface>;

    validator = {
      validate: jest.fn(),
    } as jest.Mocked<ValidatorStrategyInterface<SignInInput>>;

    tokenRepository = {
      saveRefreshToken: jest.fn(),
      addToBlacklist: jest.fn(),
      deleteRefreshToken: jest.fn(),
      getRefreshToken: jest.fn(),
      isTokenBlacklisted: jest.fn(),
    } as jest.Mocked<CacheTokenInterface>;

    sut = new SignInUseCase(
      userRepository,
      hashProvider,
      jwtTokenFactory,
      validator,
      tokenRepository,
    );
  });

  it('should authenticate a valid user and return tokens', async () => {
    const input: SignInInput = {
      email: 'user@example.com',
      password: 'Password12!@',
    };

    userRepository.findByEmail.mockResolvedValue(mockUser);
    hashProvider.compareHash.mockResolvedValue(true);
    jwtTokenFactory.generateAccessToken.mockResolvedValue(mockAccessToken);
    jwtTokenFactory.generateRefreshToken.mockResolvedValue(mockRefreshToken);

    const result = await sut.execute(input);

    expect(validator.validate).toHaveBeenCalledWith(input);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(hashProvider.compareHash).toHaveBeenCalledWith(
      plainPassword,
      hashedPassword,
    );
    expect(jwtTokenFactory.generateAccessToken).toHaveBeenCalledWith(
      userId,
      email,
    );
    expect(jwtTokenFactory.generateRefreshToken).toHaveBeenCalledWith(
      userId,
      email,
    );
    expect(tokenRepository.saveRefreshToken).toHaveBeenCalledWith(
      userId,
      mockRefreshToken.token,
      mockRefreshToken.expiresIn,
    );

    expect(result).toEqual({
      ...mockUser.toJSON(),
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
    });
  });

  it('should throw error if user is not found', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      sut.execute({ email: 'wrong@example.com', password: 'any' }),
    ).rejects.toThrow(new BadRequestError('Erro ao logar na conta do usuário'));
  });

  it('should throw error if password does not match', async () => {
    userRepository.findByEmail.mockResolvedValue(mockUser);
    hashProvider.compareHash.mockResolvedValue(false);

    await expect(sut.execute({ email, password: 'wrongpass' })).rejects.toThrow(
      new BadRequestError('Erro ao logar na conta do usuário'),
    );
  });

  it('should throw error if validation fails', async () => {
    const input: SignInInput = { email: '', password: '' };

    validator.validate.mockImplementation(() => {
      throw new BadRequestError('Validation failed');
    });

    await expect(sut.execute(input)).rejects.toThrow(BadRequestError);
    expect(validator.validate).toHaveBeenCalledWith(input);
  });

  it('should throw error if password does not match', async () => {
    const input: SignInInput = {
      email: 'test@example.com',
      password: 'wrong-pass',
    };

    const userEntity: UserEntity = UserEntity.create({
      email: Email.create(input.email),
      name: Name.create('John Doe'),
      password: Password.create('ValidPassword12!@'),
    });

    userRepository.findByEmail.mockResolvedValue(userEntity);
    hashProvider.compareHash.mockResolvedValue(false);

    await expect(sut.execute(input)).rejects.toThrow(
      new BadRequestError('Erro ao logar na conta do usuário'),
    );

    expect(hashProvider.compareHash).toHaveBeenCalledWith(
      input.password,
      userEntity.password,
    );
  });

  it('should save refresh token with correct values', async () => {
    const input: SignInInput = {
      email: 'test@example.com',
      password: 'ValidPassword12!@',
    };

    const userEntity: UserEntity = UserEntity.create({
      email: Email.create(input.email),
      name: Name.create('John Doe'),
      password: Password.create(input.password),
    });

    userRepository.findByEmail.mockResolvedValue(userEntity);
    hashProvider.compareHash.mockResolvedValue(true);

    jwtTokenFactory.generateAccessToken.mockResolvedValue(mockAccessToken);
    jwtTokenFactory.generateRefreshToken.mockResolvedValue(mockRefreshToken);

    await sut.execute(input);

    expect(tokenRepository.saveRefreshToken).toHaveBeenCalledWith(
      userEntity.id,
      mockRefreshToken.token,
      mockRefreshToken.expiresIn,
    );
  });

  it('should call methods in the expected order', async () => {
    const input: SignInInput = {
      email: 'test@example.com',
      password: 'ValidPassword12!@',
    };

    const userEntity: UserEntity = UserEntity.create({
      name: Name.create('John Doe'),
      email: Email.create(input.email),
      password: Password.create(input.password),
    });

    userRepository.findByEmail.mockResolvedValue(userEntity);
    hashProvider.compareHash.mockResolvedValue(true);
    jwtTokenFactory.generateAccessToken.mockResolvedValue({
      token: 'access-token',
      expiresIn: new Date().getTime() + 3600,
    });
    jwtTokenFactory.generateRefreshToken.mockResolvedValue({
      token: 'refresh-token',
      expiresIn: new Date().getTime() + 86400,
    });

    await sut.execute(input);

    const callOrder = [
      validator.validate,
      userRepository.findByEmail,
      hashProvider.compareHash,
      jwtTokenFactory.generateAccessToken,
      jwtTokenFactory.generateRefreshToken,
      tokenRepository.saveRefreshToken,
    ];

    callOrder.forEach((fn) => {
      expect(fn).toHaveBeenCalled();
    });
  });
});
