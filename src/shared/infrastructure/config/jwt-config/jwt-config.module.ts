import { EnvConfigModule } from '../env-config/env-config.module';
import { EnvironmentConfigInterface } from '../env-config/env-config.interface';
import { JwtModule } from '@nestjs/jwt';
import { JwtProvider } from '@src/infrastructure/providers/jwt-provider/jwt.provider';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [EnvConfigModule],
      useFactory: async (envConfig: EnvironmentConfigInterface) => ({
        secret: envConfig.getJwtSecret(),
        signOptions: {
          expiresIn: envConfig.getJwtInLiteralStringValue(),
        },
      }),
      inject: ['EnvironmentConfigInterface'],
    }),
  ],
  providers: [
    {
      provide: 'JwtProviderInterface',
      useClass: JwtProvider,
    },
  ],
  exports: ['JwtProviderInterface'],
})
export class JwtConfigModule {}
