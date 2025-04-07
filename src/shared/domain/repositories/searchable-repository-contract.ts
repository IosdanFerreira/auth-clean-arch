import { BadRequestError } from '../errors/bad-request-error';
import { Entity } from '../entities/entity';
import { MetaInterface } from '../interfaces/meta.interface';
import { RepositoryInterface } from './repository-contract';

// Define os tipos permitidos para a direção de ordenação: ascendente ('asc') ou descendente ('desc').
export type SortDirection = 'asc' | 'desc';

// Define as propriedades aceitas ao realizar uma pesquisa. Inclui paginação, ordenação e filtro.
export type SearchProps<Filter = string> = {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortDirection | null;
  filter?: Filter | null;
};

// Define as propriedades aceitas ao realizar uma pesquisa. Inclui paginação, ordenação e filtro.
export type SearchResultProps<T extends Entity, Filter> = {
  items: T[];
  totalItems: number;
  currentPage: number;
  perPage: number;
  sort: string | null;
  sortDir: SortDirection | null;
  filter: Filter | null;
};

// Classe responsável por encapsular os parâmetros de pesquisa e fornecer validação e comportamento padrão.
export class SearchParams<Filter = string> {
  private _page: number;
  private _perPage: number;
  private _sort: string | null;
  private _sortDir: SortDirection | null;
  private _filter: Filter | null;

  constructor(props: SearchProps<Filter> = {}) {
    this._page = this.normalizePage(props.page);
    this._perPage = this.normalizePerPage(props.perPage);
    this._sort = this.normalizeSort(props.sort);
    this._sortDir = this.normalizeSortDir(props.sortDir);
    this._filter = this.normalizeFilter(props.filter);
  }

  private normalizePage(value?: number): number {
    if (value === undefined || value === null) return 1;

    const page = Number(value);

    return isNaN(page) || page <= 0 || !Number.isInteger(page) ? 1 : page;
  }

  private normalizePerPage(value?: number): number {
    if (value === undefined || value === null) return 15;
    const perPage = Number(value);
    return isNaN(perPage) || perPage <= 0 || !Number.isInteger(perPage)
      ? 15
      : perPage;
  }

  private normalizeSort(value?: string | null): string | null {
    if (value === null || value === undefined || value === '')
      return 'createdAt';
    return String(value).trim();
  }

  private normalizeSortDir(value?: SortDirection | null): SortDirection | null {
    if (value === null || value === undefined) return 'desc';
    return value.toLowerCase() === 'asc' ? 'asc' : 'desc';
  }

  private normalizeFilter(value?: Filter | null): Filter | null {
    if (value === null || value === undefined || value === '') return null;
    return value;
  }

  // Getters (mantidos iguais)
  get page() {
    return this._page;
  }
  get perPage() {
    return this._perPage;
  }
  get sort() {
    return this._sort;
  }
  get sortDir() {
    return this._sortDir;
  }
  get filter() {
    return this._filter;
  }
}

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

// Interface que define os métodos necessários para repositórios que suportam pesquisa avançada.
export interface SearchableRepositoryInterface<
  T extends Entity,
  Filter = string,
  SearchInput = SearchParams<Filter>,
  SearchOutput = SearchResult<T, Filter>,
> extends RepositoryInterface<T> {
  sortableFields: string[];
  search(props: SearchInput): Promise<SearchOutput>;
}
