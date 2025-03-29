export interface EnvironmentConfigInterface {
  getAppPort(): number;
  getNodeEnv(): string;
  getJwtSecret(): string;
  getJwtExpiresInSeconds(): number;
  getJwtInLiteralStringValue(): string;
  getJwtRefreshSecret(): string;
  getJwtRefreshExpiresInSeconds(): number;
  getJwtRefreshInLiteralStringValue(): string;
}
