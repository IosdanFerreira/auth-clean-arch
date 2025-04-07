import { BcryptjsHashProvider } from '@src/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { StandardPaginationMapper } from '@src/shared/application/mappers/standard-pagination.mapper';

@Module({
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'PaginationMapperInterface',
      useClass: StandardPaginationMapper,
    },
    {
      provide: 'HashProviderInterface',
      useClass: BcryptjsHashProvider,
    },
  ],
  exports: [
    'PrismaService',
    'PaginationMapperInterface',
    'HashProviderInterface',
  ],
})
export class SharedModule {}
