import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { DynamicModule, Module } from '@nestjs/common';

import { EnvConfigService } from './env-config.service';
import { join } from 'node:path';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'EnvironmentConfigInterface',
      useClass: EnvConfigService,
    },
  ],
  exports: ['EnvironmentConfigInterface'],
})
export class EnvConfigModule extends ConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): Promise<DynamicModule> {
    return super.forRoot({
      ...options,
      envFilePath: [
        join(__dirname, `../../../../.env.${process.env.NODE_ENV}`),
      ],
    });
  }
}
