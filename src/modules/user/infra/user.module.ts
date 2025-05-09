import {
  GetUserByEmailInput,
  GetUserByEmailUseCase,
} from '../application/use-cases/get-user-by-email/get-user-by-email.use-case';
import {
  UpdatePasswordInput,
  UpdatePasswordUseCase,
} from '../application/use-cases/update-password/update-password.use-case';
import {
  UpdateUserInput,
  UpdateUserUseCase,
} from '../application/use-cases/update-user/update-user.use-case';

import { AuthRepositoryDatabase } from './database/prisma/repositories/user-prisma.repository';
import { DeleteUserUseCase } from '../application/use-cases/delete-user/delete-user.use-case';
import { GetUserByEmailUseCaseValidator } from '../application/use-cases/get-user-by-email/validator/get-user-by-email-use-case.validator';
import { HashProviderInterface } from '@src/shared/application/interfaces';
import { Module } from '@nestjs/common';
import { PrismaService } from '@src/shared/infrastructure/database/prisma/prisma.service';
import { SharedModule } from '@src/shared/infrastructure/modules/shared/shared.module';
import { UpdatePasswordUseCaseValidator } from '../application/use-cases/update-password/validators/update-password.validator';
import { UpdateUserUseCaseValidator } from '../application/use-cases/update-user/validators/update-user.validator';
import { UserController } from './user.controller';
import { UserRepositoryInterface } from '../domain/repositories/user.repository';
import { ValidatorStrategyInterface } from '@src/shared/domain/interfaces';

@Module({
  imports: [SharedModule],
  controllers: [UserController],
  providers: [
    {
      provide: 'UserRepository',
      useFactory: (prismaService: PrismaService) => {
        return new AuthRepositoryDatabase(prismaService);
      },
      inject: ['PrismaService'],
    },
    GetUserByEmailUseCaseValidator,
    {
      provide: GetUserByEmailUseCase,
      useFactory: (
        userRepository: UserRepositoryInterface,
        validator: ValidatorStrategyInterface<GetUserByEmailInput>,
      ) => {
        return new GetUserByEmailUseCase(userRepository, validator);
      },
      inject: ['UserRepository', GetUserByEmailUseCaseValidator],
    },
    UpdateUserUseCaseValidator,
    {
      provide: UpdateUserUseCase,
      useFactory: (
        userRepository: UserRepositoryInterface,
        validator: ValidatorStrategyInterface<UpdateUserInput>,
      ) => {
        return new UpdateUserUseCase(userRepository, validator);
      },
      inject: ['UserRepository', UpdateUserUseCaseValidator],
    },
    UpdatePasswordUseCaseValidator,
    {
      provide: UpdatePasswordUseCase,
      useFactory: (
        userRepository: UserRepositoryInterface,
        hashProvider: HashProviderInterface,
        validator: ValidatorStrategyInterface<UpdatePasswordInput>,
      ) => {
        return new UpdatePasswordUseCase(
          userRepository,
          hashProvider,
          validator,
        );
      },
      inject: [
        'UserRepository',
        'HashProviderInterface',
        UpdatePasswordUseCaseValidator,
      ],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (userRepository: UserRepositoryInterface) => {
        return new DeleteUserUseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
  ],
  exports: [SharedModule, 'UserRepository'],
})
export class UserModule {}
