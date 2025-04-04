import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './infrastructure/modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { EnvConfigModule } from './shared/infrastructure/config/env-config/env-config.module';
import { JwtAuthGuard } from './shared/infrastructure/guards/jwt-auth.guard';
import { JwtConfigModule } from './shared/infrastructure/config/jwt-config/jwt-config.module';
import { Module } from '@nestjs/common';
import { UserModule } from './infrastructure/modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UserModule,
    DatabaseModule,
    EnvConfigModule,
    AuthModule,
    JwtConfigModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
