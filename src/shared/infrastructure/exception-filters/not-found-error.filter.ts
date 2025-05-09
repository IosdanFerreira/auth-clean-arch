import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import { BaseResponse } from '../presenters/base-response.presenter';
import { NotFoundError } from '@src/shared/domain/errors';
import { Response } from 'express';

@Catch(NotFoundError)
export class NotFoundErrorFilter implements ExceptionFilter {
  catch(exception: NotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response
      .status(HttpStatus.NOT_FOUND)
      .send(
        BaseResponse.error(
          HttpStatus.NOT_FOUND,
          exception.name,
          exception.errors,
          exception.message,
        ),
      );
  }
}
