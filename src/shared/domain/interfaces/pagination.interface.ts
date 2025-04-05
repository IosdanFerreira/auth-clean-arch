export interface PaginationInterface {
  totalItems: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
  prevPage: number | null;
  nextPage: number | null;
}
