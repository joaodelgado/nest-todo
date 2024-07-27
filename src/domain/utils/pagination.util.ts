export interface PaginatedFilter<T> {
  filter: T;
  page: number;
  size: number;
}

export interface PaginatedResult<T> {
  page: number;
  has_next: boolean;
  content: T[];
}
