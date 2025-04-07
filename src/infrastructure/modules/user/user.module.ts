import {
  GetUserByEmail,
  GetUserByEmailInput,
} from '@src/application/use-cases/user/get-user-by-email/get-user-by-email.use-case';
import {
  ListUsers,
  ListUsersInput,
} from '@src/application/use-cases/user/list-user/list-users.use-case';
import {
  UpdatePassword,
  UpdatePasswordInput,
} from '@src/application/use-cases/user/update-password/update-password.use-case';
import {
  UpdateUser,
  UpdateUserInput,
} from '@src/application/use-cases/user/update-user/update-user.use-case';

import { AuthRepositoryDatabase } from './database/prisma/repositories/user-prisma.repository';
import { DeleteUser } from '@src/application/use-cases/user/delete-user/delete-user.use-case';
import { GetUserByEmailValidator } from '@src/application/use-cases/user/get-user-by-email/validator/get-user-by-email.validator';
import { HashProviderInterface } from '@src/shared/application/providers/hash-provider.interface';
import { ListUsersValidator } from '@src/application/use-cases/user/list-user/validator/list-user.validator';
import { Module } from '@nestjs/common';
import { PaginationMapperInterface } from '@src/shared/application/mappers/pagination-mapper.interface';
import { PrismaService } from '@src/shared/infrastructure/database/prisma/prisma.service';
import { SharedModule } from '@src/shared/infrastructure/module/shared/shared.module';
import { UpdatePasswordValidator } from '@src/application/use-cases/user/update-password/validator/update-password.validator';
import { UpdateUserValidator } from '@src/application/use-cases/user/update-user/validator/update-user.validator';
import { UserController } from './user.controller';
import { UserRepositoryInterface } from '@src/domain/repositories/user.repository';
import { ValidatorInterface } from '@src/shared/application/validators/validator.interface';

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
    GetUserByEmailValidator,
    {
      provide: GetUserByEmail,
      useFactory: (
        userRepository: UserRepositoryInterface,
        validator: ValidatorInterface<GetUserByEmailInput>,
      ) => {
        return new GetUserByEmail(userRepository, validator);
      },
      inject: ['UserRepository', GetUserByEmailValidator],
    },
    ListUsersValidator,
    {
      provide: ListUsers,
      useFactory: (
        userRepository: UserRepositoryInterface,
        paginationMapper: PaginationMapperInterface,
        validator: ValidatorInterface<ListUsersInput>,
      ) => {
        return new ListUsers(userRepository, paginationMapper, validator);
      },
      inject: [
        'UserRepository',
        'PaginationMapperInterface',
        ListUsersValidator,
      ],
    },
    UpdateUserValidator,
    {
      provide: UpdateUser,
      useFactory: (
        userRepository: UserRepositoryInterface,
        validator: ValidatorInterface<UpdateUserInput>,
      ) => {
        return new UpdateUser(userRepository, validator);
      },
      inject: ['UserRepository', UpdateUserValidator],
    },
    UpdatePasswordValidator,
    {
      provide: UpdatePassword,
      useFactory: (
        userRepository: UserRepositoryInterface,
        hashProvider: HashProviderInterface,
        validator: ValidatorInterface<UpdatePasswordInput>,
      ) => {
        return new UpdatePassword(userRepository, hashProvider, validator);
      },
      inject: [
        'UserRepository',
        'HashProviderInterface',
        UpdatePasswordValidator,
      ],
    },
    {
      provide: DeleteUser,
      useFactory: (userRepository: UserRepositoryInterface) => {
        return new DeleteUser(userRepository);
      },
      inject: ['UserRepository'],
    },
  ],
  exports: [SharedModule, 'UserRepository'],
})
export class UserModule {}
