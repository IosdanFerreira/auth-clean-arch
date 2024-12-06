import { DynamicModule, Module } from '@nestjs/common';
import { EnvironmentConfigService } from './environment-config.service';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { join } from 'path';

@Module({
  providers: [EnvironmentConfigService],
})
export class EnvironmentConfigModule extends ConfigModule {
  static forRoot(options?: ConfigModuleOptions): Promise<DynamicModule> {
    return super.forRoot({
      ...options,
      envFilePath: [
        join(__dirname, `../../../../.env.${process.env.NODE_ENV}`),
      ],
    });
  }
}
