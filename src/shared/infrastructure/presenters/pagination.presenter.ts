import { Transform } from 'class-transformer';
export type PaginationPresenterProps = {
  currentPage: number;
  perPage: number;
  lastPage: number;
  totalItems: number;
};
export class PaginationPresenter {
  @Transform(({ value }) => parseInt(value))
  currentPage: number;

  @Transform(({ value }) => parseInt(value))
  perPage: number;

  @Transform(({ value }) => parseInt(value))
  lastPage: number;

  @Transform(({ value }) => parseInt(value))
  totalItems: number;
  
  constructor(props: PaginationPresenterProps) {
    this.currentPage = props.currentPage;
    this.perPage = props.perPage;
    this.lastPage = props.lastPage;
    this.totalItems = props.totalItems;
  }
}
