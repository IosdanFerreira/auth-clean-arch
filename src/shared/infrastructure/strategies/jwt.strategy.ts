import { ExtractJwt, Strategy } from 'passport-jwt';

import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UnauthorizedError } from '@src/shared/domain/errors/unauthorized.error';
import { EnvironmentConfigInterface } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Cria uma instância da estratégia de autenticação JWT.
   * @param configService - Serviço de configuração do ambiente.
   */
  constructor(
    @Inject('EnvironmentConfigInterface')
    private readonly configService: EnvironmentConfigInterface,
  ) {
    super({
      /**
       * Função que extrai o token JWT da requisição.
       * Nesse caso, estamos usando o cabeçalho de autorização da requisição.
       */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      /**
       * Se verdadeiro, o Passport ir  verificar se o token está expirado.
       */
      ignoreExpiration: false,
      /**
       * Chave secreta usada para assinar o token JWT.
       */
      secretOrKey: configService.getJwtSecret(),
    });
  }

  /**
   * Valida o token de acesso.
   * @param payload - Payload do token de acesso.
   * @returns Uma promessa que resolve para um objeto com as informações do usuário.
   * @throws UnauthorizedError - Se o token de acesso for inválido ou expirado.
   */
  async validate(payload: any): Promise<{ userId: string; email: string }> {
    if (payload.type !== 'access') {
      throw new UnauthorizedError('Acesso negado', [
        {
          property: 'token',
          message: 'Token de acesso inválido ou expirado',
        },
      ]);
    }

    return { userId: payload.sub, email: payload.email };
  }
}
