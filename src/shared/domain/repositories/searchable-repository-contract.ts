import { Entity } from '../entities/entity';
import { RepositoryInterface } from './repository-contract';

// Define os tipos permitidos para a direção de ordenação: ascendente ('asc') ou descendente ('desc').
export type SortDirection = 'asc' | 'desc';

// Define as propriedades aceitas ao realizar uma pesquisa. Inclui paginação, ordenação e filtro.
export type SearchProps<Filter = string> = {
  page?: number;
  perPage?: number;
  lastPage?: number;
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
  sortDir: string | null;
  filter: Filter | null;
};

// Classe responsável por encapsular os parâmetros de pesquisa e fornecer validação e comportamento padrão.
export class SearchParams<Filter = string> {
  protected _page: number;
  protected _perPage = 15;
  protected _sort: string | null;
  protected _sortDir: SortDirection | null;
  protected _filter: Filter | null;

  constructor(props: SearchProps<Filter> = {}) {
    this.page = props.page;
    this.perPage = props.perPage;
    this.sort = props.sort;
    this.sortDir = props.sortDir;
    this.filter = props.filter;
  }

  // Getter para a página atual.
  get page() {
    return this._page;
  }

  // Setter privado que valida e define a página atual.
  // Garante que o valor seja um número válido e maior que 0.
  private set page(value: number) {
    let _page = +value;

    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1;
    }

    this._page = _page;
  }

  // Getter para o número de itens por página.
  get perPage() {
    return this._perPage;
  }

  // Setter privado que valida e define o número de itens por página.
  private set perPage(value: number) {
    let _perPage = value === (true as any) ? this._perPage : +value;

    if (
      Number.isNaN(_perPage) ||
      _perPage <= 0 ||
      parseInt(_perPage as any) !== _perPage
    ) {
      _perPage = this._perPage;
    }

    this._perPage = _perPage;
  }

  // Getter para o campo de ordenação.
  get sort() {
    return this._sort;
  }

  // Setter privado que valida e define o campo de ordenação.
  private set sort(value: string | null) {
    this._sort =
      value === null || value === undefined || value === '' ? null : `${value}`;
  }

  // Getter para a direção de ordenação.
  get sortDir() {
    return this._sortDir;
  }

  // Setter privado que valida e define a direção de ordenação.
  // Se não houver um campo de ordenação definido, a direção será nula.
  private set sortDir(value: string | null) {
    if (!this.sort) {
      this._sortDir = null;
      return;
    }
    const dir = `${value}`.toLowerCase();
    this._sortDir = dir !== 'asc' && dir !== 'desc' ? 'desc' : dir;
  }

  // Getter para o filtro.
  get filter(): Filter | null {
    return this._filter;
  }

  // Setter privado que valida e define o filtro.
  private set filter(value: Filter | null) {
    this._filter =
      value === null || value === undefined || value === ''
        ? null
        : (`${value}` as any);
  }
}

export class SearchResult<T extends Entity, Filter = string> {
  readonly items: T[];
  readonly totalItems: number;
  readonly currentPage: number;
  readonly perPage: number;
  readonly lastPage: number;
  readonly sort: string | null;
  readonly sortDir: string | null;
  readonly filter: Filter | null;

  constructor(props: SearchResultProps<T, Filter>) {
    this.items = props.items;
    this.totalItems = props.totalItems;
    this.currentPage = props.currentPage;
    this.perPage = props.perPage;
    this.lastPage = Math.ceil(this.totalItems / this.perPage);
    this.sort = props.sort ?? null;
    this.sortDir = props.sortDir ?? null;
    this.filter = props.filter ?? null;
  }

  toJSON(forceEntity = false) {
    return {
      items: forceEntity ? this.items.map((item) => item.toJson()) : this.items,
      totalItems: this.totalItems,
      currentPage: this.currentPage,
      perPage: this.perPage,
      lastPage: this.lastPage,
      sort: this.sort,
      sortDir: this.sortDir,
      filter: this.filter,
    };
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
