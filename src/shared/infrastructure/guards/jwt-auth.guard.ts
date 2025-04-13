import { ExecutionContext, Injectable } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core'; // Usado para acessar metadados dos decoradores
import { UnauthorizedError } from '@src/shared/domain/errors/unauthorized.error';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Verifica se a rota ou o método tem o decorador `@IsPublic()`
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Se a rota é pública, permite o acesso sem passar pela autenticação
    if (isPublic) {
      return true;
    }

    // Chama o método `canActivate` da classe pai para validar o JWT
    const canActivate = super.canActivate(context);

    // Se o resultado é boolean (síncrono), retorna diretamente
    if (typeof canActivate === 'boolean') {
      return canActivate;
    }

    // Se o resultado é uma Promise, trata possíveis erros
    const canActivatePromise = canActivate as Promise<boolean>;

    return canActivatePromise.catch(() => {
      throw new UnauthorizedError('Acesso não autorizado', [
        {
          property: 'token',
          message: 'Token expirado ou inválido',
        },
      ]);
    });
  }
}
