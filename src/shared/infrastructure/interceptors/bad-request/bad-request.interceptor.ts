import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';

import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { catchError } from 'rxjs/operators';

@Injectable()
export class BadRequestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // Se for um BadRequestError, trata o erro
        if (error instanceof BadRequestError) {
          const ctx = context.switchToHttp();
          const response = ctx.getResponse();

          const formattedErrors = error.errors;

          const result = {
            statusCode: HttpStatus.BAD_REQUEST,
            success: false,
            errorType: 'Bad Request',
            errors: formattedErrors,
            message: 'Erro na requisição, verifique os dados',
            data: null,
            pagination: null,
          };

          response.status(HttpStatus.BAD_REQUEST).json(result);
        }

        // Se não for um BadRequestError, propague o erro para outros handlers
        return throwError(() => error);
      }),
    );
  }
}
