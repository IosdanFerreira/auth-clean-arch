import { MetaInterface } from '@src/shared/domain/interfaces/meta.interface';

export type PaginationOutputInterface<T> = {
  items: T[];
  meta: MetaInterface;
};
