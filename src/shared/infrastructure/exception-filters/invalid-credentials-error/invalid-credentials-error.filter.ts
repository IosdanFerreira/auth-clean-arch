import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { InvalidCredentialsError } from '@src/shared/domain/errors/invalid-credentials-error';
import { Response } from 'express';

@Catch(InvalidCredentialsError)
export class InvalidCredentialsErrorFilter implements ExceptionFilter {
  catch(exception: InvalidCredentialsError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: exception.message,
    });
  }
}
