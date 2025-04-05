import { Module, forwardRef } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { AuthRepositoryDatabase } from './database/prisma/repositories/user-prisma.repository';
import { BcryptjsHashProvider } from '../../providers/hash-provider/bcryptjs-hash.provider';
import { DeleteUser } from '@src/application/use-cases/user/delete-user/delete-user.use-case';
import { GetUserByEmail } from '@src/application/use-cases/user/get-user-by-email/get-user-by-email.use-case';
import { HashProviderInterface } from '@src/shared/application/providers/hash-provider.interface';
import { JwtProviderInterface } from '@src/shared/application/providers/jwt-provider.interface';
import { ListUsers } from '@src/application/use-cases/user/list-user/list-users.use-case';
import { PaginationMapperInterface } from '@src/shared/application/mappers/pagination-mapper.interface';
import { PrismaService } from '@src/shared/infrastructure/database/prisma/prisma.service';
import { Signin } from '@src/application/use-cases/user/signin/signin.use-case';
import { Signup } from '@src/application/use-cases/user/signup/signup.use-case';
import { StandardPaginationMapper } from '@src/shared/application/mappers/standard-pagination.mapper';
import { UpdatePassword } from '@src/application/use-cases/user/update-password/update-password.use-case';
import { UpdateUser } from '@src/application/use-cases/user/update-user/update-user.use-case';
import { UserController } from './user.controller';
import { UserRepositoryInterface } from '@src/domain/repositories/user.repository';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'PaginationMapperInterface',
      useClass: StandardPaginationMapper,
    },
    {
      provide: 'UserRepository',
      useFactory: (prismaService: PrismaService) => {
        return new AuthRepositoryDatabase(prismaService);
      },
      inject: ['PrismaService'],
    },
    {
      provide: 'HashProviderInterface',
      useClass: BcryptjsHashProvider,
    },
    {
      provide: Signup,
      useFactory: (
        userRepository: UserRepositoryInterface,
        hashProvider: HashProviderInterface,
      ) => {
        return new Signup(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProviderInterface'],
    },
    {
      provide: Signin,
      useFactory: (
        userRepository: UserRepositoryInterface,
        hashProvider: HashProviderInterface,
        jwtProvider: JwtProviderInterface,
      ) => {
        return new Signin(userRepository, hashProvider, jwtProvider);
      },
      inject: [
        'UserRepository',
        'HashProviderInterface',
        'JwtProviderInterface',
      ],
    },
    {
      provide: GetUserByEmail,
      useFactory: (userRepository: UserRepositoryInterface) => {
        return new GetUserByEmail(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: ListUsers,
      useFactory: (
        userRepository: UserRepositoryInterface,
        paginationMapper: PaginationMapperInterface,
      ) => {
        return new ListUsers(userRepository, paginationMapper);
      },
      inject: ['UserRepository', 'PaginationMapperInterface'],
    },
    {
      provide: UpdateUser,
      useFactory: (userRepository: UserRepositoryInterface) => {
        return new UpdateUser(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdatePassword,
      useFactory: (
        userRepository: UserRepositoryInterface,
        hashProvider: HashProviderInterface,
      ) => {
        return new UpdatePassword(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProviderInterface'],
    },
    {
      provide: DeleteUser,
      useFactory: (userRepository: UserRepositoryInterface) => {
        return new DeleteUser(userRepository);
      },
      inject: ['UserRepository'],
    },
  ],
})
export class UserModule {}
