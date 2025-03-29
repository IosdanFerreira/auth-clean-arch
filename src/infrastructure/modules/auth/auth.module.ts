// src/infrastructure/modules/auth/auth.module.ts
import { Module, forwardRef } from '@nestjs/common';

import { JwtConfigModule } from '@src/shared/infrastructure/config/jwt-config/jwt-config.module';
import { JwtStrategy } from '@src/shared/infrastructure/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => UserModule),
    JwtConfigModule,
  ],
  providers: [JwtStrategy],
  exports: [PassportModule, JwtConfigModule],
})
export class AuthModule {}
