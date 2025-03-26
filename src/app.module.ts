import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
import { Module } from '@nestjs/common';
import { UserModule } from './infrastructure/user/user.module';

@Module({
  imports: [ConfigModule, UserModule, DatabaseModule, EnvConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
