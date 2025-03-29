import { ConfigModule, ConfigService } from '@nestjs/config';

import { JwtModule } from '@nestjs/jwt';
import { JwtProvider } from '@src/infrastructure/providers/jwt-provider/jwt.provider';
// src/infrastructure/config/jwt/jwt-config.module.ts
import { Module } from '@nestjs/common';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
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
