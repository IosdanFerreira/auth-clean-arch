import {
  JwtTokenFactoryInterface,
  JwtTokenInterface,
} from '@src/modules/auth/application/interfaces';
import {
  RefreshTokenInput,
  RefreshTokenUseCase,
} from '../../refresh-token.use-case';

import { BadRequestError } from '@src/shared/domain/errors';
import { CacheTokenInterface } from '@src/modules/auth/application/interfaces/cache-token.interface';

describe('RefreshTokenUseCase unit tests', () => {
  let sut: RefreshTokenUseCase;

  let tokenFactory: jest.Mocked<JwtTokenFactoryInterface>;
  let tokenRepository: jest.Mocked<CacheTokenInterface>;

  beforeEach(() => {
    tokenFactory = {
      generateAccessToken: jest.fn(),
      verifyToken: jest.fn(),
      generateRefreshToken: jest.fn(),
    } as jest.Mocked<JwtTokenFactoryInterface>;

    tokenRepository = {
      getRefreshToken: jest.fn(),
      saveRefreshToken: jest.fn(),
      deleteRefreshToken: jest.fn(),
      addToBlacklist: jest.fn(),
      isTokenBlacklisted: jest.fn(),
    } as jest.Mocked<CacheTokenInterface>;

    sut = new RefreshTokenUseCase(tokenFactory, tokenRepository);
  });

  const input: RefreshTokenInput = {
    refreshToken: 'valid.refresh.token',
  };

  const payload = {
    sub: 'user-id-123',
    email: 'user@example.com',
  };

  const accessToken: JwtTokenInterface = {
    token: 'new.access.token',
    expiresIn: 3600,
  };

  it('should verify the refresh token', async () => {
    tokenFactory.verifyToken.mockResolvedValue(payload);
    tokenRepository.getRefreshToken.mockResolvedValue(input.refreshToken);
    tokenFactory.generateAccessToken.mockResolvedValue(accessToken);

    await sut.execute(input);

    expect(tokenFactory.verifyToken).toHaveBeenCalledWith(input.refreshToken);
  });

  it('should throw error if refresh token is not found in cache', async () => {
    tokenFactory.verifyToken.mockResolvedValue(payload);
    tokenRepository.getRefreshToken.mockResolvedValue(null);

    await expect(sut.execute(input)).rejects.toThrow(
      new BadRequestError('Refresh token inválido ou expirado', [
        { property: 'refreshToken', message: 'Refresh token inválido' },
      ]),
    );

    expect(tokenRepository.getRefreshToken).toHaveBeenCalledWith(
      payload.sub,
      input.refreshToken,
    );
  });

  it('should generate new access token if refresh token is valid and found in cache', async () => {
    tokenFactory.verifyToken.mockResolvedValue(payload);
    tokenRepository.getRefreshToken.mockResolvedValue(input.refreshToken);
    tokenFactory.generateAccessToken.mockResolvedValue(accessToken);

    const result = await sut.execute(input);

    expect(tokenFactory.generateAccessToken).toHaveBeenCalledWith(
      payload.sub,
      payload.email,
    );
    expect(result).toEqual({ accessToken });
  });

  it('should call getRefreshToken with correct parameters', async () => {
    tokenFactory.verifyToken.mockResolvedValue(payload);
    tokenRepository.getRefreshToken.mockResolvedValue(input.refreshToken);
    tokenFactory.generateAccessToken.mockResolvedValue(accessToken);

    await sut.execute(input);

    expect(tokenRepository.getRefreshToken).toHaveBeenCalledWith(
      payload.sub,
      input.refreshToken,
    );
  });

  it('should throw error if verifyToken throws', async () => {
    tokenFactory.verifyToken.mockRejectedValue(new Error('Invalid token'));

    await expect(sut.execute(input)).rejects.toThrow('Invalid token');
  });

  it('should throw error if generateAccessToken fails', async () => {
    tokenFactory.verifyToken.mockResolvedValue(payload);
    tokenRepository.getRefreshToken.mockResolvedValue(input.refreshToken);
    tokenFactory.generateAccessToken.mockRejectedValue(
      new Error('Token error'),
    );

    await expect(sut.execute(input)).rejects.toThrow('Token error');
  });
});
