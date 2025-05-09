import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { EnvironmentConfigInterface } from '../../interfaces';
import { Injectable } from '@nestjs/common';
import { JwtProviderInterface } from '@src/shared/application/interfaces';
import { SigningOptions } from 'crypto';

@Injectable()
export class JwtProvider implements JwtProviderInterface {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envConfig: EnvironmentConfigInterface,
  ) {}

  /**
   * Gera um token JWT baseado no payload fornecido e as opções de assinatura.
   *
   * @param payload - Os dados que serão incluídos no token.
   * @param options - As opções de assinatura para o token, exceto aquelas definidas por SigningOptions.
   * @returns Uma string que representa o token JWT gerado.
   */
  async generateToken(
    payload: any,
    options?: Omit<JwtSignOptions, keyof SigningOptions>,
  ): Promise<string> {
    // Determina o segredo com base no tipo de token (refresh ou access)
    const secret =
      payload.type === 'refresh'
        ? this.envConfig.getJwtRefreshSecret()
        : this.envConfig.getJwtSecret();

    // Configura as opções adicionais para o JWT
    const opts = {
      ...options,
      secret,
      expiresIn:
        payload.type === 'refresh'
          ? this.envConfig.getJwtRefreshInLiteralStringValue()
          : this.envConfig.getJwtInLiteralStringValue(),
    };

    // Gera e retorna o token JWT
    return this.jwtService.signAsync(payload, opts);
  }

  /**
   * Verifica se o token fornecido é válido e retorna o payload que foi utilizado
   * para gerá-lo.
   *
   * @param token - O token JWT a ser verificado.
   * @param type - O tipo do token (access ou refresh).
   * @returns O payload que foi utilizado para gerar o token.
   */
  async verifyToken(
    token: string,
    type: 'access' | 'refresh' = 'access',
  ): Promise<any> {
    // Determina o segredo com base no tipo de token (refresh ou access)
    const secret =
      type === 'refresh'
        ? this.envConfig.getJwtRefreshSecret()
        : this.envConfig.getJwtSecret();

    // Verifica o token e retorna o payload
    return this.jwtService.verifyAsync(token, { secret });
  }
}
