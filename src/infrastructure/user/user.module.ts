import { AuthRepositoryDatabase } from './database/prisma/repositories/user-prisma.repository';
import { BcryptjsHashProvider } from '../providers/hash-provider/bcryptjs-hash.provider';
import { DeleteUser } from '@src/application/use-cases/user/delete-user.use-case';
import { GetUserByEmail } from '@src/application/use-cases/user/get-user-by-email.use-case';
import { HashProviderInterface } from '@src/shared/application/providers/hash-provider';
import { ListUsers } from '@src/application/use-cases/user/list-users.use-case';
import { Module } from '@nestjs/common';
import { PrismaService } from '@src/shared/infrastructure/database/prisma/prisma.service';
import { Signin } from '@src/application/use-cases/user/signin.use-case';
import { Signup } from '@src/application/use-cases/user/signup.use-case';
import { UpdatePassword } from '@src/application/use-cases/user/update-password.use-case';
import { UpdateUser } from '@src/application/use-cases/user/update-user.use-case';
import { UserController } from './user.controller';
import { UserRepository } from '@src/domain/repositories/user.repository';

@Module({
  controllers: [UserController],
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
export class UserModule {}
