import { CacheTokenInterface } from '@src/modules/auth/application/interfaces/cache-token.interface';
import { EnvironmentConfigInterface } from '@src/shared/infrastructure/interfaces';
// src/auth/infrastructure/persistence/redis/redis-token.repository.ts
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisTokenRepository implements CacheTokenInterface {
  private readonly client: Redis;

  constructor(private readonly envConfig: EnvironmentConfigInterface) {
    this.client = new Redis({
      host: this.envConfig.getRedisHost() || 'redis',
      port: this.envConfig.getRedisPort() || 6379,
    });
  }

  async saveRefreshToken(
    userId: string,
    token: string,
    expiresIn: number,
  ): Promise<void> {
    await this.client.set(
      `refresh_token:${userId}:${token}`,
      userId,
      'EX',
      expiresIn,
    );
  }

  async getRefreshToken(userId: string, token: string): Promise<string | null> {
    return this.client.get(`refresh_token:${userId}:${token}`);
  }

  async deleteRefreshToken(userId: string, token: string): Promise<void> {
    await this.client.del(`refresh_token:${userId}:${token}`);
  }

  async addToBlacklist(token: string, expiresIn: number): Promise<void> {
    await this.client.set(`blacklist:${token}`, '1', 'EX', expiresIn);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return (await this.client.exists(`blacklist:${token}`)) === 1;
  }
}
