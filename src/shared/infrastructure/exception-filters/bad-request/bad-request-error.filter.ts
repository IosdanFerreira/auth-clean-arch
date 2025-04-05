import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import { BadRequestError } from '@src/shared/domain/errors/bad-request-error';
import { BaseResponse } from '../../presenters/base-response.presenter';
import { Response } from 'express';

@Catch(BadRequestError)
export class BadRequestErrorFilter implements ExceptionFilter {
  catch(exception: BadRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response
      .status(HttpStatus.BAD_REQUEST)
      .send(
        BaseResponse.error(
          HttpStatus.BAD_REQUEST,
          exception.name,
          exception.errors,
          exception.message,
        ),
      );
  }
}
