import {
  Signin,
  SigninInput,
} from '@src/application/use-cases/user/signin/signin.use-case';
import {
  Signup,
  SignupInput,
} from '@src/application/use-cases/user/signup/signup.use-case';

import { AuthController } from './auth.controller';
import { HashProviderInterface } from '@src/shared/application/providers/hash-provider.interface';
import { JwtConfigModule } from '@src/shared/infrastructure/config/jwt-config/jwt-config.module';
import { JwtProviderInterface } from '@src/shared/application/providers/jwt-provider.interface';
import { JwtStrategy } from '@src/shared/infrastructure/strategies/jwt.strategy';
// src/infrastructure/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SharedModule } from '@src/shared/infrastructure/module/shared/shared.module';
import { SigninValidator } from '@src/application/use-cases/user/signin/validator/signin.validator';
import { SignupValidator } from '@src/application/use-cases/user/signup/validator/signup.validator';
import { UserModule } from '../user/user.module';
import { UserRepositoryInterface } from '@src/domain/repositories/user.repository';
import { ValidatorInterface } from '@src/shared/application/validators/validator.interface';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    SharedModule,
    UserModule,
    JwtConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    SignupValidator,
    {
      provide: Signup,
      useFactory: (
        userRepository: UserRepositoryInterface,
        hashProvider: HashProviderInterface,
        validator: ValidatorInterface<SignupInput>,
      ) => {
        return new Signup(userRepository, hashProvider, validator);
      },
      inject: ['UserRepository', 'HashProviderInterface', SignupValidator],
    },
    SigninValidator,
    {
      provide: Signin,
      useFactory: (
        userRepository: UserRepositoryInterface,
        hashProvider: HashProviderInterface,
        jwtProvider: JwtProviderInterface,
        validator: ValidatorInterface<SigninInput>,
      ) => {
        return new Signin(userRepository, hashProvider, jwtProvider, validator);
      },
      inject: [
        'UserRepository',
        'HashProviderInterface',
        'JwtProviderInterface',
        SigninValidator,
      ],
    },
  ],
  exports: [PassportModule, JwtConfigModule],
})
export class AuthModule {}
