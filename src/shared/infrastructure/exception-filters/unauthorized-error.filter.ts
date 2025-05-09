import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import { BaseResponse } from '../presenters/base-response.presenter';
import { Response } from 'express';
import { UnauthorizedError } from '@src/shared/domain/errors/unauthorized.error';

@Catch(UnauthorizedError)
export class UnauthorizedErrorFilter implements ExceptionFilter {
  catch(exception: UnauthorizedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response
      .status(HttpStatus.UNAUTHORIZED)
      .send(
        BaseResponse.error(
          HttpStatus.UNAUTHORIZED,
          exception.name,
          exception.errors,
          exception.message,
        ),
      );
  }
}
