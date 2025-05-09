import { SearchProps } from '../interfaces';
import { SortDirection } from '../types';

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
