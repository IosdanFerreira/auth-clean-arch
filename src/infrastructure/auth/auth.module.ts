import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { BcryptjsHashProvider } from '../providers/hash-provider/bcryptjs-hash.provider';
import { Signup } from '@src/application/use-cases/auth/signup.use-case';
import { UserRepository } from '@src/domain/repositories/user.repository';
import { HashProviderInterface } from '@src/shared/application/providers/hash-provider';
import { Signin } from '@src/application/use-cases/auth/signin.use-case';
import { GetUserByEmail } from '@src/application/use-cases/auth/get-user-by-email.use-case';
import { ListUsers } from '@src/application/use-cases/auth/list-users.use-case';
import { UpdateUser } from '@src/application/use-cases/auth/update-user.use-case';
import { UpdatePassword } from '@src/application/use-cases/auth/update-password.use-case';
import { DeleteUser } from '@src/application/use-cases/auth/delete-user.use-case';
import { AuthRepositoryDatabase } from './database/prisma/repositories/auth.repository';
import { PrismaService } from '@src/shared/infrastructure/database/prisma/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'UserRepository',
      useFactory: (prismaService: PrismaService) => {
        return new AuthRepositoryDatabase(prismaService);
      },
      inject: ['PrismaService'],
    },
    {
      provide: 'HashProvider',
      useClass: BcryptjsHashProvider,
    },
    {
      provide: Signup,
      useFactory: (
        userRepository: UserRepository,
        hashProvider: HashProviderInterface,
      ) => {
        return new Signup(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: Signin,
      useFactory: (
        userRepository: UserRepository,
        hashProvider: HashProviderInterface,
      ) => {
        return new Signin(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: GetUserByEmail,
      useFactory: (userRepository: UserRepository) => {
        return new GetUserByEmail(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: ListUsers,
      useFactory: (userRepository: UserRepository) => {
        return new ListUsers(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUser,
      useFactory: (userRepository: UserRepository) => {
        return new UpdateUser(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdatePassword,
      useFactory: (
        userRepository: UserRepository,
        hashProvider: HashProviderInterface,
      ) => {
        return new UpdatePassword(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: DeleteUser,
      useFactory: (userRepository: UserRepository) => {
        return new DeleteUser(userRepository);
      },
      inject: ['UserRepository'],
    },
  ],
})
export class AuthModule {}
