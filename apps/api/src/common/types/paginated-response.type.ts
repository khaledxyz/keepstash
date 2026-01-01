export class PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}
