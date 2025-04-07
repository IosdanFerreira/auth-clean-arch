import { ConfigService } from '@nestjs/config';
import { EnvironmentConfigInterface } from './env-config.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvConfigService implements EnvironmentConfigInterface {
  constructor(private configService: ConfigService) {}

  getAppPort(): number {
    return Number(this.configService.get<number>('PORT'));
  }

  getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV');
  }

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  getJwtExpiresInSeconds(): number {
    return this.configService.get<number>('JWT_EXPIRES_IN_SECONDS');
  }

  getJwtInLiteralStringValue(): string {
    return this.configService.get<string>(
      'JWT_EXPIRES_IN_LITERAL_STRING_VALUE',
    );
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('REFRESH_JWT_SECRET');
  }

  getJwtRefreshExpiresInSeconds(): number {
    return this.configService.get<number>('REFRESH_JWT_EXPIRES_IN_SECONDS');
  }

  getJwtRefreshInLiteralStringValue(): string {
    return this.configService.get<string>(
      'REFRESH_JWT_EXPIRES_IN_LITERAL_STRING_VALUE',
    );
  }
}
