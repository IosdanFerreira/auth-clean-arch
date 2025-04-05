import { MetaInterface } from '@src/shared/domain/interfaces/meta.interface';

export type PaginationOutputDto<T> = {
  items: T[];
  meta: MetaInterface;
};
