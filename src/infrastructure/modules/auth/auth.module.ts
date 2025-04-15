import {
  Signin,
  SigninInput,
} from '@src/application/use-cases/auth/signin/signin.use-case';
import {
  Signup,
  SignupInput,
} from '@src/application/use-cases/auth/signup/signup.use-case';

import { AuthController } from './auth.controller';
import { CacheTokenRepositoryInterface } from '@src/application/interfaces/cache-token.repository.interface';
import { EnvConfigModule } from '@src/shared/infrastructure/config/env-config/env-config.module';
import { EnvironmentConfigInterface } from '@src/shared/infrastructure/config/env-config/env-config.interface';
import { HashProviderInterface } from '@src/shared/application/providers/hash-provider.interface';
import { JwtConfigModule } from '@src/shared/infrastructure/config/jwt-config/jwt-config.module';
import { JwtTokenFactoryInterface } from '@src/application/factories/jwt-token/interfaces/jwt-token.factory.interface';
import { Module } from '@nestjs/common';
import { RedisTokenRepository } from './persistence/redis/redis-token.repository';
import { RefreshTokenUseCase } from '@src/application/use-cases/auth/refresh-token/refresh-token.use-case';
import { SharedModule } from '@src/shared/infrastructure/module/shared/shared.module';
import { SigninValidator } from '@src/application/use-cases/auth/signin/validator/signin.validator';
import { SignupValidator } from '@src/application/use-cases/auth/signup/validator/signup.validator';
import { UserModule } from '../user/user.module';
import { UserRepositoryInterface } from '@src/domain/repositories/user.repository';
import { ValidatorInterface } from '@src/shared/application/validators/validator.interface';

@Module({
  imports: [SharedModule, UserModule, JwtConfigModule, EnvConfigModule],
  controllers: [AuthController],
  providers: [
    // Signup
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

    // Signin
    SigninValidator,
    {
      provide: Signin,
      useFactory: (
        userRepository: UserRepositoryInterface,
        hashProvider: HashProviderInterface,
        jwtTokenFactory: JwtTokenFactoryInterface,
        validator: ValidatorInterface<SigninInput>,
        tokenRepository: CacheTokenRepositoryInterface,
      ) => {
        return new Signin(
          userRepository,
          hashProvider,
          jwtTokenFactory,
          validator,
          tokenRepository,
        );
      },
      inject: [
        'UserRepository',
        'HashProviderInterface',
        'JwtTokenFactoryInterface',
        SigninValidator,
        'CacheTokenRepositoryInterface',
      ],
    },

    // Refresh Token
    {
      provide: 'CacheTokenRepositoryInterface',
      useFactory: (envConfig: EnvironmentConfigInterface) => {
        return new RedisTokenRepository(envConfig);
      },
      inject: ['EnvironmentConfigInterface'],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (
        tokenFactory: JwtTokenFactoryInterface,
        tokenRepository: CacheTokenRepositoryInterface,
      ) => {
        return new RefreshTokenUseCase(tokenFactory, tokenRepository);
      },
      inject: ['JwtTokenFactoryInterface', 'CacheTokenRepositoryInterface'],
    },
  ],
  exports: [JwtConfigModule],
})
export class AuthModule {}
