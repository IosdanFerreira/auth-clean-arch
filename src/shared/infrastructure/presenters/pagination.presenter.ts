import { ApiProperty } from '@nestjs/swagger';
import { SortDirection } from '@src/shared/domain/repositories/searchable-repository-contract';

export class PaginationPresenter {
  @ApiProperty({ description: 'Total de itens' })
  totalItems: number;

  @ApiProperty({ description: 'Página atual' })
  currentPage: number;

  @ApiProperty({ description: 'Itens por página' })
  perPage: number;

  @ApiProperty({ description: 'Total de páginas' })
  totalPages: number;

  @ApiProperty({ description: 'Página anterior', nullable: true })
  prevPage: number | null;

  @ApiProperty({ description: 'Próxima página', nullable: true })
  nextPage: number | null;

  constructor(props: {
    totalItems: number;
    currentPage: number;
    perPage: number;
    totalPages: number;
    prevPage: number | null;
    nextPage: number | null;
  }) {
    this.totalItems = props.totalItems;
    this.currentPage = props.currentPage;
    this.perPage = props.perPage;
    this.totalPages = props.totalPages;
    this.prevPage = props.prevPage;
    this.nextPage = props.nextPage;
  }
}

export class MetaPresenter<Filter = string> {
  @ApiProperty({ type: PaginationPresenter })
  pagination: PaginationPresenter;

  @ApiProperty({ description: 'Campo de ordenação', nullable: true })
  sort: string | null;

  @ApiProperty({
    description: 'Direção da ordenação (asc/desc)',
    enumName: 'SortDirection',
  })
  sortDir: SortDirection;

  @ApiProperty({ description: 'Filtro aplicado', nullable: true })
  filter: Filter | null;

  constructor(props: {
    pagination: PaginationPresenter;
    sort: string | null;
    sortDir: SortDirection;
    filter: Filter | null;
  }) {
    this.pagination = props.pagination;
    this.sort = props.sort;
    this.sortDir = props.sortDir;
    this.filter = props.filter;
  }
}
