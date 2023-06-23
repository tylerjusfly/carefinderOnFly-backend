export interface PaginatedResult {
  success: boolean;

  result: any;

  totalPages: number;
  /**
   * the amount of items that were requested per page
   */
  itemsPerPage: number;

  totalItems: number;
  /**
   * the current page this paginator "points" to
   */
  currentPage: number;
}
