/**
 * Pagination configuration and state
 */
export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Pagination service for managing file list pagination
 */
class PaginationService {
  private state: PaginationState = {
    currentPage: 1,
    itemsPerPage: 21, // 3 columns × 7 items per column
    totalItems: 0,
    totalPages: 0
  };

  /**
   * Initialize pagination with total item count
   */
  initialize(totalItems: number): void {
    const previousTotalItems = this.state.totalItems;
    this.state.totalItems = totalItems;
    this.state.totalPages = Math.ceil(totalItems / this.state.itemsPerPage);
    
    // Only reset to page 1 if total items changed or current page is invalid
    if (previousTotalItems !== totalItems || this.state.currentPage > this.state.totalPages) {
      this.state.currentPage = Math.min(this.state.currentPage, this.state.totalPages || 1);
      // Reset to page 1 only if it was a different dataset
      if (previousTotalItems !== totalItems) {
        this.state.currentPage = 1;
      }
    }
  }

  /**
   * Get current pagination state
   */
  getState(): PaginationState {
    return { ...this.state };
  }

  /**
   * Set current page
   */
  setPage(page: number): boolean {
    if (page < 1 || page > this.state.totalPages) {
      return false;
    }
    this.state.currentPage = page;
    return true;
  }

  /**
   * Go to next page
   */
  nextPage(): boolean {
    return this.setPage(this.state.currentPage + 1);
  }

  /**
   * Go to previous page
   */
  previousPage(): boolean {
    return this.setPage(this.state.currentPage - 1);
  }

  /**
   * Go to first page
   */
  firstPage(): void {
    this.state.currentPage = 1;
  }

  /**
   * Go to last page
   */
  lastPage(): void {
    this.state.currentPage = this.state.totalPages || 1;
  }

  /**
   * Get slice of items for current page
   */
  getCurrentPageSlice<T>(items: T[]): T[] {
    const startIndex = (this.state.currentPage - 1) * this.state.itemsPerPage;
    const endIndex = startIndex + this.state.itemsPerPage;
    return items.slice(startIndex, endIndex);
  }

  /**
   * Get page range for pagination controls
   * Returns array of page numbers to display
   */
  getPageRange(maxPages: number = 7): number[] {
    const { currentPage, totalPages } = this.state;
    
    if (totalPages <= maxPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfRange = Math.floor(maxPages / 2);
    let start = Math.max(1, currentPage - halfRange);
    let end = Math.min(totalPages, start + maxPages - 1);

    if (end - start < maxPages - 1) {
      start = Math.max(1, end - maxPages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  /**
   * Reset pagination to initial state
   */
  reset(): void {
    this.state.currentPage = 1;
    this.state.totalItems = 0;
    this.state.totalPages = 0;
  }

  /**
   * Check if there is a next page
   */
  hasNextPage(): boolean {
    return this.state.currentPage < this.state.totalPages;
  }

  /**
   * Check if there is a previous page
   */
  hasPreviousPage(): boolean {
    return this.state.currentPage > 1;
  }
}

// Export singleton instance
export const paginationService = new PaginationService();
