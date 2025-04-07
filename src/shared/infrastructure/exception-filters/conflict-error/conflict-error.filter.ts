import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import { BaseResponse } from '../../presenters/base-response.presenter';
import { ConflictError } from '@src/shared/domain/errors/conflict-error';
import { Response } from 'express';

@Catch(ConflictError)
export class ConflictErrorFilter implements ExceptionFilter {
  catch(exception: ConflictError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response
      .status(409)
      .send(
        BaseResponse.error(
          HttpStatus.CONFLICT,
          exception.name,
          exception.errors,
          exception.message,
        ),
      );
  }
}
