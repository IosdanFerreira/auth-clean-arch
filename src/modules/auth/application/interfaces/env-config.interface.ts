export interface EnvConfigInterface {
  getAppPort(): number;
  getNodeEnv(): string;
  getJwtSecret(): string;
  getJwtExpiresInSeconds(): number;
  getJwtInLiteralStringValue(): string;
  getJwtRefreshSecret(): string;
  getJwtRefreshExpiresInSeconds(): number;
  getJwtRefreshInLiteralStringValue(): string;
  getRedisHost(): string;
  getRedisPort(): number;
}
