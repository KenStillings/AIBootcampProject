import { paginationService } from '../src/scripts/paginationService';

describe('PaginationService', () => {
  beforeEach(() => {
    paginationService.reset();
  });

  describe('initialize', () => {
    test('should calculate total pages correctly for full pages', () => {
      paginationService.initialize(100);
      const state = paginationService.getState();
      
      expect(state.totalItems).toBe(100);
      expect(state.totalPages).toBe(5); // 100 items / 21 per page = 5 pages
      expect(state.currentPage).toBe(1);
      expect(state.itemsPerPage).toBe(21);
    });

    test('should calculate total pages with partial last page', () => {
      paginationService.initialize(75);
      const state = paginationService.getState();
      
      expect(state.totalItems).toBe(75);
      expect(state.totalPages).toBe(4); // 75 items = 4 pages (21+21+21+12)
    });

    test('should handle single page correctly', () => {
      paginationService.initialize(20);
      const state = paginationService.getState();
      
      expect(state.totalPages).toBe(1);
      expect(state.currentPage).toBe(1);
    });

    test('should handle empty data', () => {
      paginationService.initialize(0);
      const state = paginationService.getState();
      
      expect(state.totalItems).toBe(0);
      expect(state.totalPages).toBe(0);
      expect(state.currentPage).toBe(1);
    });

    test('should reset current page to 1', () => {
      paginationService.initialize(100);
      paginationService.setPage(2);
      paginationService.initialize(150);
      
      expect(paginationService.getState().currentPage).toBe(1);
    });
  });

  describe('setPage', () => {
    beforeEach(() => {
      paginationService.initialize(150); // 8 pages
    });

    test('should set valid page number', () => {
      paginationService.setPage(2);
      expect(paginationService.getState().currentPage).toBe(2);
    });

    test('should ignore page number less than 1', () => {
      paginationService.setPage(2);
      paginationService.setPage(0);
      expect(paginationService.getState().currentPage).toBe(2);
      
      paginationService.setPage(-1);
      expect(paginationService.getState().currentPage).toBe(2);
    });

    test('should ignore page number greater than total pages', () => {
      paginationService.setPage(2);
      paginationService.setPage(10); // Only 8 pages available
      expect(paginationService.getState().currentPage).toBe(2);
    });

    test('should accept last page', () => {
      paginationService.setPage(8);
      expect(paginationService.getState().currentPage).toBe(8);
    });
  });

  describe('nextPage', () => {
    beforeEach(() => {
      paginationService.initialize(150); // 8 pages
    });

    test('should move to next page', () => {
      paginationService.nextPage();
      expect(paginationService.getState().currentPage).toBe(2);
    });

    test('should not exceed total pages', () => {
      paginationService.setPage(8);
      paginationService.nextPage();
      expect(paginationService.getState().currentPage).toBe(8);
    });

    test('should work from first page', () => {
      expect(paginationService.getState().currentPage).toBe(1);
      paginationService.nextPage();
      expect(paginationService.getState().currentPage).toBe(2);
    });
  });

  describe('previousPage', () => {
    beforeEach(() => {
      paginationService.initialize(150); // 8 pages
    });

    test('should move to previous page', () => {
      paginationService.setPage(2);
      paginationService.previousPage();
      expect(paginationService.getState().currentPage).toBe(1);
    });

    test('should not go below page 1', () => {
      paginationService.previousPage();
      expect(paginationService.getState().currentPage).toBe(1);
    });

    test('should work from last page', () => {
      paginationService.setPage(8);
      paginationService.previousPage();
      expect(paginationService.getState().currentPage).toBe(7);
    });
  });

  describe('firstPage', () => {
    test('should navigate to first page', () => {
      paginationService.initialize(150);
      paginationService.setPage(3);
      paginationService.firstPage();
      expect(paginationService.getState().currentPage).toBe(1);
    });

    test('should work when already on first page', () => {
      paginationService.initialize(100);
      paginationService.firstPage();
      expect(paginationService.getState().currentPage).toBe(1);
    });
  });

  describe('lastPage', () => {
    test('should navigate to last page', () => {
      paginationService.initialize(150); // 8 pages
      paginationService.lastPage();
      expect(paginationService.getState().currentPage).toBe(8);
    });

    test('should work when already on last page', () => {
      paginationService.initialize(150);
      paginationService.lastPage();
      paginationService.lastPage();
      expect(paginationService.getState().currentPage).toBe(8);
    });

    test('should handle single page', () => {
      paginationService.initialize(20);
      paginationService.lastPage();
      expect(paginationService.getState().currentPage).toBe(1);
    });
  });

  describe('getCurrentPageSlice', () => {
    const testData = Array.from({ length: 125 }, (_, i) => i + 1);

    beforeEach(() => {
      paginationService.initialize(testData.length); // 6 pages (21*5 + 20)
    });

    test('should return first page slice', () => {
      const slice = paginationService.getCurrentPageSlice(testData);
      expect(slice).toHaveLength(21);
      expect(slice[0]).toBe(1);
      expect(slice[20]).toBe(21);
    });

    test('should return second page slice', () => {
      paginationService.setPage(2);
      const slice = paginationService.getCurrentPageSlice(testData);
      expect(slice).toHaveLength(21);
      expect(slice[0]).toBe(22);
      expect(slice[20]).toBe(42);
    });

    test('should return last page slice with partial data', () => {
      paginationService.setPage(6);
      const slice = paginationService.getCurrentPageSlice(testData);
      expect(slice).toHaveLength(20);
      expect(slice[0]).toBe(106);
      expect(slice[19]).toBe(125);
    });

    test('should return empty array for empty data', () => {
      paginationService.initialize(0);
      const slice = paginationService.getCurrentPageSlice([]);
      expect(slice).toEqual([]);
    });

    test('should return all items if less than one page', () => {
      const smallData = [1, 2, 3, 4, 5];
      paginationService.initialize(smallData.length);
      const slice = paginationService.getCurrentPageSlice(smallData);
      expect(slice).toEqual(smallData);
    });
  });

  describe('getPageRange', () => {
    test('should return all pages when total pages <= maxPages', () => {
      paginationService.initialize(150); // 8 pages
      const range = paginationService.getPageRange();
      expect(range).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    test('should center current page when in middle', () => {
      paginationService.initialize(500); // 24 pages
      paginationService.setPage(12);
      const range = paginationService.getPageRange(7);
      expect(range).toEqual([9, 10, 11, 12, 13, 14, 15]); // Center 12 with 3 on each side
    });

    test('should start from page 1 when current page is near start', () => {
      paginationService.initialize(500); // 24 pages
      paginationService.setPage(2);
      const range = paginationService.getPageRange(7);
      expect(range).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    test('should end at last page when current page is near end', () => {
      paginationService.initialize(500); // 24 pages
      paginationService.setPage(22);
      const range = paginationService.getPageRange(7);
      expect(range).toEqual([18, 19, 20, 21, 22, 23, 24]);
    });

    test('should handle single page', () => {
      paginationService.initialize(20);
      const range = paginationService.getPageRange();
      expect(range).toEqual([1]);
    });

    test('should return empty array for zero pages', () => {
      paginationService.initialize(0);
      const range = paginationService.getPageRange();
      expect(range).toEqual([]);
    });

    test('should use default maxPages of 7', () => {
      paginationService.initialize(500); // 24 pages
      paginationService.setPage(12);
      const range = paginationService.getPageRange();
      expect(range).toHaveLength(7);
    });
  });

  describe('reset', () => {
    test('should reset to initial state', () => {
      paginationService.initialize(150);
      paginationService.setPage(3);
      paginationService.reset();
      
      const state = paginationService.getState();
      expect(state.currentPage).toBe(1);
      expect(state.totalItems).toBe(0);
      expect(state.totalPages).toBe(0);
      expect(state.itemsPerPage).toBe(21);
    });

    test('should allow re-initialization after reset', () => {
      paginationService.initialize(100);
      paginationService.setPage(2);
      paginationService.reset();
      paginationService.initialize(200);
      
      const state = paginationService.getState();
      expect(state.currentPage).toBe(1);
      expect(state.totalItems).toBe(200);
      expect(state.totalPages).toBe(10);
    });
  });

  describe('hasNextPage', () => {
    test('should return true when not on last page', () => {
      paginationService.initialize(150); // 8 pages
      expect(paginationService.hasNextPage()).toBe(true);
      
      paginationService.setPage(2);
      expect(paginationService.hasNextPage()).toBe(true);
    });

    test('should return false when on last page', () => {
      paginationService.initialize(150); // 8 pages
      paginationService.setPage(8);
      expect(paginationService.hasNextPage()).toBe(false);
    });

    test('should return false for single page', () => {
      paginationService.initialize(20);
      expect(paginationService.hasNextPage()).toBe(false);
    });

    test('should return false for empty data', () => {
      paginationService.initialize(0);
      expect(paginationService.hasNextPage()).toBe(false);
    });
  });

  describe('hasPreviousPage', () => {
    test('should return false when on first page', () => {
      paginationService.initialize(150); // 8 pages
      expect(paginationService.hasPreviousPage()).toBe(false);
    });

    test('should return true when not on first page', () => {
      paginationService.initialize(150); // 8 pages
      paginationService.setPage(2);
      expect(paginationService.hasPreviousPage()).toBe(true);
      
      paginationService.setPage(8);
      expect(paginationService.hasPreviousPage()).toBe(true);
    });

    test('should return false for single page', () => {
      paginationService.initialize(20);
      expect(paginationService.hasPreviousPage()).toBe(false);
    });

    test('should return false for empty data', () => {
      paginationService.initialize(0);
      expect(paginationService.hasPreviousPage()).toBe(false);
    });
  });

  describe('edge cases', () => {
    test('should handle exactly 21 items (1 page)', () => {
      paginationService.initialize(21);
      const state = paginationService.getState();
      expect(state.totalPages).toBe(1);
    });

    test('should handle 22 items (2 pages)', () => {
      paginationService.initialize(22);
      const state = paginationService.getState();
      expect(state.totalPages).toBe(2);
    });

    test('should handle large dataset', () => {
      paginationService.initialize(1348); // User's FileList.csv size
      const state = paginationService.getState();
      expect(state.totalPages).toBe(65); // ceiling(1348/21) = 65
    });

    test('should maintain consistency across multiple operations', () => {
      paginationService.initialize(200);
      paginationService.nextPage();
      paginationService.nextPage();
      paginationService.previousPage();
      
      expect(paginationService.getState().currentPage).toBe(2);
      expect(paginationService.hasNextPage()).toBe(true);
      expect(paginationService.hasPreviousPage()).toBe(true);
    });
  });
});
