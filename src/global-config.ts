import {
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';

import { BadRequestErrorFilter } from './shared/infrastructure/exception-filters/bad-request/bad-request-error.filter';
import { ConflictErrorFilter } from './shared/infrastructure/exception-filters/conflict-error/conflict-error.filter';
import { InvalidCredentialsErrorFilter } from './shared/infrastructure/exception-filters/invalid-credentials-error/invalid-credentials-error.filter';
import { InvalidPasswordErrorFilter } from './shared/infrastructure/exception-filters/invalid-password-error/invalid-password-error.filter';
import { NotFoundErrorFilter } from './shared/infrastructure/exception-filters/not-found-error/not-found-error.filter';
import { Reflector } from '@nestjs/core';
import { WrapperDataInterceptor } from './shared/interceptors/wrapper-data/wrapper-data.interceptor';

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(
    new WrapperDataInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.useGlobalFilters(
    new ConflictErrorFilter(),
    new NotFoundErrorFilter(),
    new InvalidPasswordErrorFilter(),
    new InvalidCredentialsErrorFilter(),
    new BadRequestErrorFilter(),
  );
}
