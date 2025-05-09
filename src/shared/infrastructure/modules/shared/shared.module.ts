import { BcryptjsHashProvider } from '../../providers/hash-provider/bcryptjs-hash.provider';
import { DefaultPaginationMapper } from '@src/shared/application/mappers/default-pagination.mapper';
import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Module({
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'PaginationMapperInterface',
      useClass: DefaultPaginationMapper,
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
