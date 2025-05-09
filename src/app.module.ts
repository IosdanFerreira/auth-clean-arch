import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/infra/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { EnvConfigModule } from './shared/infrastructure/modules/env-config/env-config.module';
import { JwtAuthGuard } from './shared/infrastructure/guards/jwt-auth.guard';
import { JwtConfigModule } from './shared/infrastructure/modules/jwt-config/jwt-config.module';
import { Module } from '@nestjs/common';
import { SharedModule } from './shared/infrastructure/modules/shared/shared.module';
import { UserModule } from './modules/user/infra/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtConfigModule,
    AuthModule,
    DatabaseModule,
    EnvConfigModule,
    SharedModule,
    UserModule,
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
