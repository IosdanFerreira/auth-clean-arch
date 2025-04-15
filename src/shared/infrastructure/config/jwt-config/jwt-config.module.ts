import { JwtModule, JwtService } from '@nestjs/jwt';

import { ConfigModule } from '@nestjs/config';
import { EnvConfigModule } from '../env-config/env-config.module';
import { EnvironmentConfigInterface } from '../env-config/env-config.interface';
import { JwtProvider } from '@src/infrastructure/providers/jwt-provider/jwt.provider';
import { JwtProviderInterface } from '@src/shared/application/providers/jwt-provider.interface';
import { JwtStrategy } from '../../strategies/jwt.strategy';
import { JwtTokenFactory } from '@src/application/factories/jwt-token/jwt-token.factory';
import { JwtTokenFactoryInterface } from '@src/application/factories/jwt-token/interfaces/jwt-token.factory.interface';
import { Module } from '@nestjs/common';
import { RefreshJwtStrategy } from '../../strategies/jwt-refresh.strategy';
import jwtConfig from './jwt.config';
import jwtRefreshConfig from './jwt-refresh.config';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(jwtRefreshConfig),
    EnvConfigModule,
  ],
  providers: [
    // Strategies
    JwtStrategy,
    RefreshJwtStrategy,
    {
      provide: 'JwtProviderInterface',
      useFactory: (
        jwtService: JwtService,
        envConfig: EnvironmentConfigInterface,
      ): JwtProviderInterface => {
        return new JwtProvider(jwtService, envConfig);
      },
      inject: [JwtService, 'EnvironmentConfigInterface'],
    },
    {
      provide: 'JwtTokenFactoryInterface',
      useFactory: (
        jwtProvider: JwtProviderInterface,
        envConfig: EnvironmentConfigInterface,
      ): JwtTokenFactoryInterface => {
        return new JwtTokenFactory(jwtProvider, envConfig);
      },
      inject: ['JwtProviderInterface', 'EnvironmentConfigInterface'],
    },
  ],
  exports: [
    JwtStrategy,
    RefreshJwtStrategy,
    'JwtProviderInterface',
    'JwtTokenFactoryInterface',
  ],
})
export class JwtConfigModule {}
