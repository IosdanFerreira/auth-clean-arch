import { MetaInterface, SearchResultProps } from '../interfaces';

import { BadRequestError } from '../errors/bad-request.error';
import { Entity } from '../entities/Entity';
import { SortDirection } from '../types';

export class SearchResult<T extends Entity, Filter = string> {
  private readonly _items: T[];
  private readonly _totalItems: number;
  private readonly _currentPage: number;
  private readonly _perPage: number;
  private readonly _totalPages: number;
  private readonly _prevPage: number | null;
  private readonly _nextPage: number | null;
  private readonly _sort: string | null;
  private readonly _sortDir: SortDirection | null;
  private readonly _filter: Filter | null;

  constructor(props: SearchResultProps<T, Filter>) {
    this.validateSortDir(props.sortDir);

    this._items = props.items;
    this._totalItems = props.totalItems;
    this._currentPage = props.currentPage;
    this._perPage = props.perPage;

    this._totalPages = Math.ceil(this._totalItems / this._perPage);
    this._prevPage = this._currentPage > 1 ? this._currentPage - 1 : null;
    this._nextPage =
      this._currentPage < this._totalPages ? this._currentPage + 1 : null;

    this._sort = props.sort ?? null;
    this._sortDir = props.sortDir ?? null;
    this._filter = props.filter ?? null;
  }

  get items(): T[] {
    return this._items;
  }

  get meta(): MetaInterface {
    return {
      pagination: {
        totalItems: this._totalItems,
        currentPage: this._currentPage,
        perPage: this._perPage,
        totalPages: this._totalPages,
        prevPage: this._prevPage,
        nextPage: this._nextPage,
      },
      sort: this._sort,
      sortDir: this._sortDir as SortDirection,
      filter: this._filter as string,
    };
  }

  private validateSortDir(dir: string | null): void | Error {
    if (dir && !['asc', 'desc'].includes(dir)) {
      throw new BadRequestError('Erro na direção de ordenação', [
        {
          property: 'sortDir',
          message: 'sortDir só pode ser "asc" ou "desc"',
        },
      ]);
    }
  }
}
