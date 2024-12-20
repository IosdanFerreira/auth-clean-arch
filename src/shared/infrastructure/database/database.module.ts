import { DynamicModule, Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { EnvironmentConfigModule } from '@src/infrastructure/config/environment-config/environment-config.module';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Global()
@Module({
  imports: [EnvironmentConfigModule.forRoot()],
  providers: [PrismaService, ConfigService],
  exports: [PrismaService],
})
export class DatabaseModule {
  static forTest(prismaClient: PrismaClient): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: PrismaService,
          useFactory: () => prismaClient as PrismaService,
        },
      ],
    };
  }
}
