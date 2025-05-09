import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import { BaseResponse } from '../presenters/base-response.presenter';
import { InvalidParamError } from '@src/shared/domain/errors';
import { Response } from 'express';

@Catch(InvalidParamError)
export class InvalidParamErrorErrorFilter implements ExceptionFilter {
  catch(exception: InvalidParamError, host: ArgumentsHost) {
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
