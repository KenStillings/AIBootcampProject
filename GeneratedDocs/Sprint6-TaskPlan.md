# Sprint 6: Pagination for File List

## Sprint Overview

**Sprint Goal**: Implement pagination with 2-column layout for the file list interface to improve performance and user experience when managing large collections of files.

**Duration**: 8 hours  
**Priority**: Medium  
**Dependencies**: Sprints 1-5 complete

## Sprint Objectives

- Display files in 2-column grid layout with 50 items per page (25 items per column)
- Add pagination controls (Previous, Next, page numbers)
- Maintain pagination state across filtering and searching
- Update URL with current page (optional)
- Ensure all existing functionality works with pagination
- Add comprehensive tests for pagination logic
- Maintain 80%+ test coverage

---

## Tasks Breakdown

### ✅ Task 6.1: Pagination Service Module

**Estimated Time**: 2 hours  
**Priority**: High  
**Dependencies**: None

#### Description
Create a new pagination service module to handle all pagination logic, including calculating pages, managing current page state, and providing data slices.

#### Subtasks
- [ ] Create `src/scripts/paginationService.ts`
- [ ] Implement pagination state management
- [ ] Implement page calculation logic
- [ ] Implement data slicing for current page
- [ ] Add TypeScript types for pagination state

#### Implementation Details

**File**: `src/scripts/paginationService.ts`

```typescript
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
    itemsPerPage: 50, // 2 columns × 25 items per column
    totalItems: 0,
    totalPages: 0
  };

  /**
   * Initialize pagination with total item count
   */
  initialize(totalItems: number): void {
    this.state.totalItems = totalItems;
    this.state.totalPages = Math.ceil(totalItems / this.state.itemsPerPage);
    this.state.currentPage = Math.min(this.state.currentPage, this.state.totalPages || 1);
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
   * Reset pagination to first page
   */
  reset(): void {
    this.state.currentPage = 1;
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
```

#### Acceptance Criteria
- [ ] `paginationService.ts` created with all methods
- [ ] TypeScript types defined for pagination state
- [ ] Service can calculate total pages correctly
- [ ] Service can slice data for current page
- [ ] Service prevents invalid page numbers
- [ ] Service provides page range for UI controls
- [ ] All methods are properly typed and documented

---

### ✅ Task 6.2: Update Renderer for Pagination

**Estimated Time**: 2 hours  
**Priority**: High  
**Dependencies**: Task 6.1

#### Description
Update the renderer to use pagination service and only render files for the current page.

#### Subtasks
- [ ] Update `renderFileList()` to use pagination
- [ ] Update `renderFilteredFileList()` to use pagination
- [ ] Create `renderPaginationControls()` function
- [ ] Update empty state handling for pagination

#### Implementation Details

**File**: `src/scripts/renderer.ts`

Update imports:
```typescript
import { paginationService } from './paginationService.js';
```

Update `renderFileList()`:
```typescript
export function renderFileList(): void {
  const fileListContainer = document.getElementById('file-list') as HTMLDivElement;
  const emptyState = document.getElementById('empty-state') as HTMLDivElement;
  
  if (!fileListContainer || !emptyState) {
    console.error('File list UI elements not found');
    return;
  }

  const files = getFiles();
  
  if (files.length === 0) {
    fileListContainer.innerHTML = '';
    fileListContainer.style.display = 'none';
    emptyState.style.display = 'block';
    renderPaginationControls(0);
    return;
  }

  // Initialize pagination with total file count
  paginationService.initialize(files.length);
  
  // Get current page slice
  const pageFiles = paginationService.getCurrentPageSlice(files);
  
  emptyState.style.display = 'none';
  fileListContainer.style.display = 'grid';
  
  const fragment = document.createDocumentFragment();
  
  pageFiles.forEach((file) => {
    const fileEntry = createFileEntry(file);
    fragment.appendChild(fileEntry);
  });
  
  fileListContainer.innerHTML = '';
  fileListContainer.appendChild(fragment);
  
  // Render pagination controls
  renderPaginationControls(files.length);
}
```

Add new function:
```typescript
/**
 * Renders pagination controls
 */
export function renderPaginationControls(totalItems: number): void {
  const paginationContainer = document.getElementById('pagination-controls');
  
  if (!paginationContainer) {
    console.error('Pagination controls container not found');
    return;
  }

  if (totalItems === 0) {
    paginationContainer.style.display = 'none';
    return;
  }

  const state = paginationService.getState();
  
  if (state.totalPages <= 1) {
    paginationContainer.style.display = 'none';
    return;
  }

  paginationContainer.style.display = 'flex';
  
  const pageRange = paginationService.getPageRange();
  
  let html = `
    <button 
      class="pagination-btn" 
      data-action="first" 
      ${!paginationService.hasPreviousPage() ? 'disabled' : ''}
    >
      ⟨⟨
    </button>
    <button 
      class="pagination-btn" 
      data-action="previous" 
      ${!paginationService.hasPreviousPage() ? 'disabled' : ''}
    >
      ⟨ Previous
    </button>
  `;
  
  pageRange.forEach(page => {
    const isActive = page === state.currentPage;
    html += `
      <button 
        class="pagination-btn ${isActive ? 'active' : ''}" 
        data-action="page" 
        data-page="${page}"
      >
        ${page}
      </button>
    `;
  });
  
  html += `
    <button 
      class="pagination-btn" 
      data-action="next" 
      ${!paginationService.hasNextPage() ? 'disabled' : ''}
    >
      Next ⟩
    </button>
    <button 
      class="pagination-btn" 
      data-action="last" 
      ${!paginationService.hasNextPage() ? 'disabled' : ''}
    >
      ⟩⟩
    </button>
  `;
  
  html += `
    <span class="pagination-info">
      Page ${state.currentPage} of ${state.totalPages} (${totalItems} total)
    </span>
  `;
  
  paginationContainer.innerHTML = html;
}
```

Add pagination event handler initialization:
```typescript
/**
 * Initialize pagination controls event handlers
 */
export function initializePagination(): void {
  const paginationContainer = document.getElementById('pagination-controls');
  
  if (!paginationContainer) {
    console.error('Pagination controls container not found');
    return;
  }

  paginationContainer.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    
    if (!target.classList.contains('pagination-btn')) {
      return;
    }

    const action = target.dataset.action;
    
    switch (action) {
      case 'first':
        paginationService.firstPage();
        break;
      case 'previous':
        paginationService.previousPage();
        break;
      case 'next':
        paginationService.nextPage();
        break;
      case 'last':
        paginationService.lastPage();
        break;
      case 'page':
        const page = parseInt(target.dataset.page || '1', 10);
        paginationService.setPage(page);
        break;
    }
    
    // Re-render file list with new page
    renderFileList();
  });
}
```

#### Acceptance Criteria
- [ ] File list displays in 2-column grid layout
- [ ] Only shows 50 files per page (25 per column)
- [ ] Pagination controls render correctly
- [ ] Previous/Next buttons work
- [ ] Page number buttons work
- [ ] First/Last page buttons work
- [ ] Disabled state for buttons works correctly
- [ ] Pagination info displays current page and total
- [ ] Empty state handled correctly (no pagination shown)

---

### ✅ Task 6.3: Update Filter Functionality

**Estimated Time**: 1.5 hours  
**Priority**: High  
**Dependencies**: Task 6.2

#### Description
Ensure filtering and searching work correctly with pagination, resetting to page 1 when filters change.

#### Subtasks
- [ ] Update `renderFilteredFileList()` for pagination
- [ ] Reset to page 1 when search changes
- [ ] Reset to page 1 when filter changes
- [ ] Update filter count to show pagination info

#### Implementation Details

**File**: `src/scripts/renderer.ts`

Update `renderFilteredFileList()`:
```typescript
export function renderFilteredFileList(filteredFiles: RocksmithFile[]): void {
  const fileListContainer = document.getElementById('file-list') as HTMLDivElement;
  const emptyState = document.getElementById('empty-state') as HTMLDivElement;
  
  if (!fileListContainer || !emptyState) {
    console.error('File list UI elements not found');
    return;
  }

  if (filteredFiles.length === 0) {
    fileListContainer.innerHTML = '';
    fileListContainer.style.display = 'none';
    emptyState.style.display = 'block';
    emptyState.querySelector('p')!.textContent = 'No files match your filters.';
    renderPaginationControls(0);
    return;
  }

  // Initialize pagination with filtered file count
  paginationService.initialize(filteredFiles.length);
  
  // Get current page slice
  const pageFiles = paginationService.getCurrentPageSlice(filteredFiles);

  emptyState.style.display = 'none';
  fileListContainer.style.display = 'grid';
  
  const fragment = document.createDocumentFragment();
  
  pageFiles.forEach((file) => {
    const fileEntry = createFileEntry(file);
    fragment.appendChild(fileEntry);
  });
  
  fileListContainer.innerHTML = '';
  fileListContainer.appendChild(fragment);
  
  // Render pagination controls
  renderPaginationControls(filteredFiles.length);
}
```

**File**: `src/scripts/ui.ts`

Update `applyFilters()` to reset pagination:
```typescript
function applyFilters(): void {
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const searchTerm = searchInput.value.trim();
  
  const activeFilterBtn = document.querySelector('.filter-btn.active') as HTMLButtonElement;
  const statusFilter = activeFilterBtn?.dataset.status || 'all';
  
  // Reset pagination to first page when filters change
  paginationService.reset();
  
  if (searchTerm === '' && statusFilter === 'all') {
    renderFileList();
    updateFilterCount(getFiles().length, getFiles().length);
  } else {
    const filtered = filterFiles(searchTerm, statusFilter as FileStatus | 'all');
    renderFilteredFileList(filtered);
    updateFilterCount(filtered.length, getFiles().length);
  }
}
```

#### Acceptance Criteria
- [ ] Filtering resets pagination to page 1
- [ ] Searching resets pagination to page 1
- [ ] Filtered results show correct pagination
- [ ] Filter count includes pagination info
- [ ] Empty filter results handled correctly

---

### ✅ Task 6.4: Update HTML and CSS

**Estimated Time**: 1 hour  
**Priority**: Medium  
**Dependencies**: Task 6.2

#### Description
Add pagination controls to HTML, implement 2-column grid layout for file list, and style them appropriately.

#### Subtasks
- [ ] Update file list CSS to use 2-column grid layout
- [ ] Add pagination container to `index.html`
- [ ] Add CSS styles for pagination controls
- [ ] Ensure responsive design (single column on mobile)
- [ ] Add hover/active states for buttons

#### Implementation Details

**File**: `index.html`

Add after the `file-list-section`:
```html
<!-- Pagination Controls -->
<section class="pagination-section">
  <div id="pagination-controls" class="pagination-controls">
    <!-- Pagination buttons will be dynamically rendered here -->
  </div>
</section>
```

**File**: `src/styles/main.css`

Update file list grid for 2-column layout:
```css
/* File List Grid - 2 columns */
.file-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  max-width: 100%;
}

/* Single column on mobile */
@media (max-width: 768px) {
  .file-list {
    grid-template-columns: 1fr;
  }
}
```

Add pagination styles:
```css
/* Pagination Section */
.pagination-section {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  padding: 1rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  min-width: 2.5rem;
}

.pagination-btn:hover:not(:disabled) {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  font-weight: bold;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f5f5f5;
}

.pagination-info {
  margin-left: 1rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

/* Responsive pagination */
@media (max-width: 768px) {
  .pagination-controls {
    font-size: 0.85rem;
  }
  
  .pagination-btn {
    padding: 0.4rem 0.8rem;
    min-width: 2rem;
    font-size: 0.85rem;
  }
  
  .pagination-info {
    width: 100%;
    text-align: center;
    margin: 0.5rem 0 0 0;
  }
}
```

#### Acceptance Criteria
- [ ] Pagination controls container added to HTML
- [ ] Pagination buttons styled consistently with app
- [ ] Hover effects work correctly
- [ ] Active page button visually distinct
- [ ] Disabled buttons have clear disabled state
- [ ] Pagination is responsive on mobile devices

---

### ✅ Task 6.5: Update Main Initialization

**Estimated Time**: 0.5 hours  
**Priority**: Medium  
**Dependencies**: Task 6.2

#### Description
Update the main application initialization to include pagination setup.

#### Implementation Details

**File**: `src/scripts/main.ts`

Update imports:
```typescript
import { initializePagination } from './renderer.js';
```

Update `initializeApp()`:
```typescript
function initializeApp(): void {
  console.log('Initializing Rocksmith File Manager...');
  
  const savedFiles = loadData();
  if (savedFiles.length > 0) {
    setFiles(savedFiles);
    console.log(`Loaded ${savedFiles.length} files from storage`);
  }

  initializeFileAddition();
  initializeBulkImport();
  initializeFilters();
  initializeStatusUpdate();
  initializeDelete();
  initializePagination(); // Add pagination initialization
  
  renderFileList();
  
  console.log('Rocksmith File Manager initialized successfully');
}
```

#### Acceptance Criteria
- [ ] Pagination initializes on app load
- [ ] All existing functionality still works
- [ ] No console errors on initialization

---

### ✅ Task 6.6: Unit Tests for Pagination

**Estimated Time**: 2 hours  
**Priority**: High  
**Dependencies**: Task 6.1

#### Description
Create comprehensive unit tests for the pagination service.

#### Subtasks
- [ ] Create `tests/paginationService.test.ts`
- [ ] Test pagination state management
- [ ] Test page navigation
- [ ] Test data slicing
- [ ] Test edge cases (empty data, single page, etc.)
- [ ] Ensure 100% coverage for pagination service

#### Implementation Details

**File**: `tests/paginationService.test.ts`

```typescript
import { paginationService, PaginationState } from '../src/scripts/paginationService';

describe('PaginationService', () => {
  beforeEach(() => {
    // Reset pagination before each test
    paginationService.initialize(0);
  });

  describe('initialize', () => {
    it('should calculate total pages correctly', () => {
      paginationService.initialize(100);
      const state = paginationService.getState();
      
      expect(state.totalPages).toBe(2); // 100 items / 50 per page = 2 pages
      expect(state.totalItems).toBe(100);
      expect(state.currentPage).toBe(1);
    });

    it('should handle partial last page', () => {
      paginationService.initialize(125);
      const state = paginationService.getState();
      
      expect(state.totalPages).toBe(3); // 125 items needs 3 pages (50+50+25)
    });

    it('should handle single page', () => {
      paginationService.initialize(40);
      const state = paginationService.getState();
      
      expect(state.totalPages).toBe(1);
    });

    it('should handle empty data', () => {
      paginationService.initialize(0);
      const state = paginationService.getState();
      
      expect(state.totalPages).toBe(0);
      expect(state.currentPage).toBe(1);
    });

    it('should reset to valid page if current page exceeds total', () => {
      paginationService.initialize(100);
      paginationService.setPage(2); // Go to page 2
      
      paginationService.initialize(40); // Reduce to 1 page
      const state = paginationService.getState();
      
      expect(state.currentPage).toBe(1);
    });
  });

  describe('setPage', () => {
    beforeEach(() => {
      paginationService.initialize(100); // 4 pages
    });

    it('should set valid page number', () => {
      const result = paginationService.setPage(3);
      const state = paginationService.getState();
      
      expect(result).toBe(true);
      expect(state.currentPage).toBe(3);
    });

    it('should reject page number less than 1', () => {
      const result = paginationService.setPage(0);
      const state = paginationService.getState();
      
      expect(result).toBe(false);
      expect(state.currentPage).toBe(1); // Should remain unchanged
    });

    it('should reject page number greater than total pages', () => {
      const result = paginationService.setPage(5);
      const state = paginationService.getState();
      
      expect(result).toBe(false);
      expect(state.currentPage).toBe(1); // Should remain unchanged
    });
  });

  describe('nextPage', () => {
    beforeEach(() => {
      paginationService.initialize(100); // 4 pages
    });

    it('should advance to next page', () => {
      const result = paginationService.nextPage();
      const state = paginationService.getState();
      
      expect(result).toBe(true);
      expect(state.currentPage).toBe(2);
    });

    it('should not advance beyond last page', () => {
      paginationService.setPage(4);
      const result = paginationService.nextPage();
      const state = paginationService.getState();
      
      expect(result).toBe(false);
      expect(state.currentPage).toBe(4);
    });
  });

  describe('previousPage', () => {
    beforeEach(() => {
      paginationService.initialize(100); // 4 pages
      paginationService.setPage(3);
    });

    it('should go to previous page', () => {
      const result = paginationService.previousPage();
      const state = paginationService.getState();
      
      expect(result).toBe(true);
      expect(state.currentPage).toBe(2);
    });

    it('should not go below page 1', () => {
      paginationService.setPage(1);
      const result = paginationService.previousPage();
      const state = paginationService.getState();
      
      expect(result).toBe(false);
      expect(state.currentPage).toBe(1);
    });
  });

  describe('firstPage and lastPage', () => {
    beforeEach(() => {
      paginationService.initialize(100); // 4 pages
    });

    it('should jump to first page', () => {
      paginationService.setPage(3);
      paginationService.firstPage();
      const state = paginationService.getState();
      
      expect(state.currentPage).toBe(1);
    });

    it('should jump to last page', () => {
      paginationService.lastPage();
      const state = paginationService.getState();
      
      expect(state.currentPage).toBe(4);
    });
  });

  describe('getCurrentPageSlice', () => {
    const testData = Array.from({ length: 100 }, (_, i) => `item-${i + 1}`);

    beforeEach(() => {
      paginationService.initialize(100);
    });

    it('should return first 50 items for page 1', () => {
      paginationService.setPage(1);
      const slice = paginationService.getCurrentPageSlice(testData);
      
      expect(slice.length).toBe(50);
      expect(slice[0]).toBe('item-1');
      expect(slice[49]).toBe('item-50');
    });

    it('should return items 51-100 for page 2', () => {
      paginationService.setPage(2);
      const slice = paginationService.getCurrentPageSlice(testData);
      
      expect(slice.length).toBe(50);
      expect(slice[0]).toBe('item-51');
      expect(slice[49]).toBe('item-100');
    });

    it('should handle data smaller than page size', () => {
      const smallData = Array.from({ length: 10 }, (_, i) => `item-${i + 1}`);
      paginationService.initialize(10);
      
      const slice = paginationService.getCurrentPageSlice(smallData);
      
      expect(slice.length).toBe(10);
    });
  });

  describe('getPageRange', () => {
    it('should return all pages when total is less than max', () => {
      paginationService.initialize(150); // 3 pages (50 items per page)
      const range = paginationService.getPageRange(7);
      
      expect(range).toEqual([1, 2, 3]);
    });

    it('should return range centered on current page', () => {
      paginationService.initialize(250); // 10 pages
      paginationService.setPage(5);
      const range = paginationService.getPageRange(7);
      
      expect(range.length).toBe(7);
      expect(range).toEqual([2, 3, 4, 5, 6, 7, 8]);
    });

    it('should adjust range at start', () => {
      paginationService.initialize(250); // 10 pages
      paginationService.setPage(1);
      const range = paginationService.getPageRange(7);
      
      expect(range).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('should adjust range at end', () => {
      paginationService.initialize(250); // 10 pages
      paginationService.setPage(10);
      const range = paginationService.getPageRange(7);
      
      expect(range).toEqual([4, 5, 6, 7, 8, 9, 10]);
    });
  });

  describe('hasNextPage and hasPreviousPage', () => {
    beforeEach(() => {
      paginationService.initialize(100); // 4 pages
    });

    it('should return true for next page when not on last page', () => {
      paginationService.setPage(2);
      expect(paginationService.hasNextPage()).toBe(true);
    });

    it('should return false for next page when on last page', () => {
      paginationService.setPage(4);
      expect(paginationService.hasNextPage()).toBe(false);
    });

    it('should return false for previous page when on first page', () => {
      paginationService.setPage(1);
      expect(paginationService.hasPreviousPage()).toBe(false);
    });

    it('should return true for previous page when not on first page', () => {
      paginationService.setPage(2);
      expect(paginationService.hasPreviousPage()).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset to first page', () => {
      paginationService.initialize(100);
      paginationService.setPage(3);
      
      paginationService.reset();
      const state = paginationService.getState();
      
      expect(state.currentPage).toBe(1);
    });
  });
});
```

Update `jest.config.js` to include pagination service:
```javascript
collectCoverageFrom: [
  'src/scripts/dataService.ts',
  'src/scripts/storageService.ts',
  'src/scripts/csvParser.ts',
  'src/scripts/paginationService.ts' // Add this line
],
```

#### Acceptance Criteria
- [ ] All pagination service methods tested
- [ ] Edge cases covered (empty data, single page, boundaries)
- [ ] 100% coverage for `paginationService.ts`
- [ ] All tests passing
- [ ] Test descriptions clear and descriptive

---

## Sprint 6 Completion Checklist

### Task Completion
- [ ] Task 6.1: Pagination Service Module ✓
- [ ] Task 6.2: Update Renderer for Pagination ✓
- [ ] Task 6.3: Update Filter Functionality ✓
- [ ] Task 6.4: Update HTML and CSS ✓
- [ ] Task 6.5: Update Main Initialization ✓
- [ ] Task 6.6: Unit Tests for Pagination ✓

### Quality Gates
- [ ] All tests passing
- [ ] Code coverage ≥80%
- [ ] TypeScript compiles without errors
- [ ] No console errors in browser
- [ ] Pagination works with filtering
- [ ] Pagination works with searching
- [ ] Responsive on mobile devices

### Feature Verification
- [ ] Files display in 2-column grid layout
- [ ] 50 files per page (25 per column)
- [ ] Previous/Next buttons work
- [ ] Page number buttons work
- [ ] First/Last page buttons work
- [ ] Pagination resets on filter change
- [ ] Pagination info displays correctly
- [ ] All existing features still work
- [ ] Performance acceptable with 1000+ files

### Final Deliverables
- [ ] `paginationService.ts` implemented and tested
- [ ] Renderer updated for pagination
- [ ] HTML and CSS updated
- [ ] Main app initialization updated
- [ ] Comprehensive unit tests
- [ ] Documentation updated (if needed)

---

## Post-Sprint Activities

### Testing Checklist
1. Load application with 0 files (no pagination shown)
2. Add 49 files (1 page, no pagination shown, 2-column layout)
3. Add 51 files (2 pages, pagination shown, 2-column layout)
4. Add 200+ files (4+ pages, test navigation, verify 2-column layout)
5. Test filtering with pagination
6. Test searching with pagination
7. Test on mobile devices
8. Test keyboard navigation (if applicable)

### Performance Testing
- [ ] Pagination with 1,348 files from FileList.csv
- [ ] Page changes happen instantly (<100ms)
- [ ] No memory leaks when changing pages
- [ ] Smooth transitions between pages

### Documentation Updates
- Update README.md with pagination feature
- Update CHANGELOG.md with Sprint 6 changes
- Document pagination keyboard shortcuts (if added)

---

**Sprint Status**: Not Started  
**Created**: February 5, 2026  
**Sprint Owner**: [Your Name]  
**Estimated Completion**: February 6, 2026

