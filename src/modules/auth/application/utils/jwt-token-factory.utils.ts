import {
  EnvConfigInterface,
  JwtTokenFactoryInterface,
  JwtTokenInterface,
} from '../interfaces';

import { BadRequestError } from '@src/shared/domain/errors';
import { JwtProviderInterface } from '@src/shared/application/interfaces';

export class JwtTokenFactory implements JwtTokenFactoryInterface {
  constructor(
    private readonly jwtProvider: JwtProviderInterface,
    private readonly envConfig: EnvConfigInterface,
  ) {}

  /**
   * Gera o token de acesso
   * @param userId ID do usuário
   * @param email Email do usuário
   * @returns Uma promessa com o token de acesso gerado
   */
  async generateAccessToken(
    userId: string,
    email: string,
  ): Promise<JwtTokenInterface> {
    // Calcula o tempo de expiração do token de acesso
    const exp =
      Math.floor(Date.now() / 1000) + this.envConfig.getJwtExpiresInSeconds();

    /**
     * Gera o token utilizando o seguinte payload:
     * - sub: ID do usuário
     * - email: Email do usuário
     * - type: 'access'
     */
    const token = await this.jwtProvider.generateToken({
      sub: userId,
      email,
      type: 'access',
    });

    /**
     * Retorna o token de acesso e o tempo de expiração
     */
    return {
      token,
      expiresIn: exp,
    };
  }

  /**
   * Gera o token de refresh
   * @param userId ID do usuário
   * @param email Email do usuário
   * @returns Uma promessa com o token de refresh gerado
   */
  async generateRefreshToken(
    userId: string,
    email: string,
  ): Promise<JwtTokenInterface> {
    // Calcula o tempo de expira o do token de refresh
    const exp =
      Math.floor(Date.now() / 1000) +
      this.envConfig.getJwtRefreshExpiresInSeconds();

    /**
     * Gera o token utilizando o seguinte payload:
     * - sub: ID do usuário
     * - email: Email do usuário
     * - type: 'refresh'
     */
    const token = await this.jwtProvider.generateToken({
      sub: userId,
      email,
      type: 'refresh',
    });

    /**
     * Retorna o token de refresh e o tempo de expiração
     */
    return {
      token,
      expiresIn: exp,
    };
  }

  /**
   * Verifica um token JWT.
   * @param token O token a ser verificado.
   * @returns Uma promessa com o payload decodificado.
   * @throws Lança um erro se o token for inválido ou não for um token de refresh.
   */
  async verifyToken(token: string): Promise<any> {
    // Tenta verificar o token como um refresh token
    const payload = await this.jwtProvider.verifyToken(token, 'refresh');

    // Verifica se o payload possui o tipo 'refresh'
    if (payload.type !== 'refresh') {
      throw new BadRequestError('Token is not a refresh token', [
        { property: 'token', message: 'Token não é um refresh token' },
      ]);
    }

    // Retorna o payload decodificado
    return payload;
  }
}
