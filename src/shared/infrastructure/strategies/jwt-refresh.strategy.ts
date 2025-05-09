import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UnauthorizedError } from '@src/shared/domain/errors/unauthorized.error';
import { EnvironmentConfigInterface } from '../interfaces';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  /**
   * Construtor da estratégia de autenticação JWT para refresh token.
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
      secretOrKey: configService.getJwtRefreshSecret(),
    });
  }

  /**
   * Valida o token de acesso.
   * @param payload - Payload do token de acesso.
   * @returns Uma promessa que resolve para um objeto com as informações do usuário.
   * @throws UnauthorizedError - Se o token de acesso for inválido ou expirado.
   */
  async validate(payload: any): Promise<{ userId: string; email: string }> {
    if (!payload.type || payload.type !== 'refresh') {
      throw new UnauthorizedError('Token de atualização inválido', [
        {
          property: 'token',
          message: `Tipo de token recebido: ${payload.type || 'não definido'} (esperado: refresh)`,
        },
      ]);
    }

    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
