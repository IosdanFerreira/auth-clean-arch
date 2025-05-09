import {
  SignInInput,
  SignInUseCase,
} from '../application/use-cases/signin/signin.use-case';
import {
  SignUpUseCase,
  SignupInput,
} from '../application/use-cases/signup/signup.use-case';

import { AuthController } from './auth.controller';
import { CacheTokenInterface } from '../application/interfaces/cache-token.interface';
import { EnvConfigModule } from '@src/shared/infrastructure/modules/env-config/env-config.module';
import { EnvironmentConfigInterface } from '@src/shared/infrastructure/interfaces';
import { HashProviderInterface } from '@src/shared/application/interfaces';
import { JwtConfigModule } from '@src/shared/infrastructure/modules/jwt-config/jwt-config.module';
import { JwtTokenFactoryInterface } from '../application/interfaces';
import { Module } from '@nestjs/common';
import { RedisTokenRepository } from './repositories/redis/redis-token.repository';
import { RefreshTokenUseCase } from '../application/use-cases/refresh-token/refresh-token.use-case';
import { SharedModule } from '@src/shared/infrastructure/modules/shared/shared.module';
import { SigninUseCaseValidator } from '../application/use-cases/signin/validators/signin-use-case.validator';
import { SignupUseCaseValidator } from '../application/use-cases/signup/validators/signup.validator';
import { UserModule } from '@src/modules/user/infra/user.module';
import { UserRepositoryInterface } from '@src/modules/user/domain/repositories/user.repository';
import { ValidatorStrategyInterface } from '@src/shared/domain/interfaces';

@Module({
  imports: [SharedModule, UserModule, JwtConfigModule, EnvConfigModule],
  controllers: [AuthController],
  providers: [
    // Signup
    SignupUseCaseValidator,
    {
      provide: SignUpUseCase,
      useFactory: (
        userRepository: UserRepositoryInterface,
        hashProvider: HashProviderInterface,
        validator: ValidatorStrategyInterface<SignupInput>,
      ) => {
        return new SignUpUseCase(userRepository, hashProvider, validator);
      },
      inject: [
        'UserRepository',
        'HashProviderInterface',
        SignupUseCaseValidator,
      ],
    },

    // Signin
    SigninUseCaseValidator,
    {
      provide: SignInUseCase,
      useFactory: (
        userRepository: UserRepositoryInterface,
        hashProvider: HashProviderInterface,
        jwtTokenFactory: JwtTokenFactoryInterface,
        validator: ValidatorStrategyInterface<SignInInput>,
        tokenRepository: CacheTokenInterface,
      ) => {
        return new SignInUseCase(
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
        SigninUseCaseValidator,
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
        tokenRepository: CacheTokenInterface,
      ) => {
        return new RefreshTokenUseCase(tokenFactory, tokenRepository);
      },
      inject: ['JwtTokenFactoryInterface', 'CacheTokenRepositoryInterface'],
    },
  ],
  exports: [JwtConfigModule],
})
export class AuthModule {}
