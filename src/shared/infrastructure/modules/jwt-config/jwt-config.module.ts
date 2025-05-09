import { JwtModule, JwtService } from '@nestjs/jwt';

import { ConfigModule } from '@nestjs/config';
import { EnvConfigModule } from '../env-config/env-config.module';
import { EnvironmentConfigInterface } from '../../interfaces';
import { JwtProvider } from '../../providers/jwt-provider/jwt.provider';
import { JwtProviderInterface } from '@src/shared/application/interfaces';
import { JwtStrategy } from '../../strategies/jwt.strategy';
import { JwtTokenFactory } from '@src/modules/auth/application/utils/jwt-token-factory.utils';
import { JwtTokenFactoryInterface } from '@src/modules/auth/application/interfaces';
import { Module } from '@nestjs/common';
import { RefreshJwtStrategy } from '../../strategies/jwt-refresh.strategy';
import jwtConfig from './jwt-config';
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
