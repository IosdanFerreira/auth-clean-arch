import { JwtTokenFactoryInterface, JwtTokenInterface } from '../../interfaces';

import { BadRequestError } from '@src/shared/domain/errors';
import { CacheTokenInterface } from '../../interfaces/cache-token.interface';

export class RefreshTokenUseCase {
  constructor(
    private readonly tokenFactory: JwtTokenFactoryInterface,
    private readonly tokenRepository: CacheTokenInterface,
  ) {}

  /**
   * Executa o processo de renovação do token de acesso.
   * @param input Objeto contendo o token de refresh.
   * @returns Uma promessa com o novo token de acesso.
   * @throws Lança um erro se o payload do token for inválido.
   */
  async execute(input: RefreshTokenInput): Promise<RefreshTokenOutput> {
    // Verifica se o token de refresh é válido
    const payload = await this.tokenFactory.verifyToken(input.refreshToken);

    // Verifica se o token de refresh está armazenado no cache do Redis
    const storedToken = await this.tokenRepository.getRefreshToken(
      payload.sub,
      input.refreshToken,
    );

    // Lança um erro se o token de refresh não for encontrado no cache
    if (!storedToken) {
      throw new BadRequestError('Refresh token inválido ou expirado', [
        { property: 'refreshToken', message: 'Refresh token inválido' },
      ]);
    }

    // Gera um novo token de acesso com base no ID do usuário e email
    const accessToken = await this.tokenFactory.generateAccessToken(
      payload.sub,
      payload.email,
    );

    // Retorna o novo token de acesso
    return { accessToken };
  }
}

export type RefreshTokenInput = {
  refreshToken: string;
};

export type RefreshTokenOutput = {
  accessToken: JwtTokenInterface;
};
