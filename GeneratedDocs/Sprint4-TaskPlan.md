# Sprint 4: Bulk Import & Polish

**Sprint Duration**: Days 16-20 (Week 4)  
**Sprint Goal**: Implement CSV import and UI enhancements  
**Total Estimated Time**: 14 hours

---

## Sprint Overview

This sprint focuses on enhancing the application with bulk import capabilities and polishing the user interface. By the end of this sprint, the Rocksmith File Manager will have all planned features for the MVP and a refined, professional user experience.

---

## Prerequisites

Before starting Sprint 4, ensure Sprint 3 is complete:
- ✓ All CRUD operations work
- ✓ Data persists in localStorage
- ✓ Status updates function correctly
- ✓ Delete functionality works

---

## Tasks

### ✅ Task 4.1: Implement CSV Parser

**Estimated Time**: 3 hours  
**Priority**: High  
**Dependencies**: Task 2.1 (Data Service)  
**Status**: [ ] Not Started

#### Subtasks Checklist

- [ ] Create `src/scripts/csvParser.ts`
- [ ] Implement parser that handles both newline and comma-delimited formats
- [ ] Handle trimming of whitespace
- [ ] Remove empty entries
- [ ] Handle various formats (newlines, commas, with/without spaces)
- [ ] Return array of file names
- [ ] Add error handling for malformed input
- [ ] Auto-detect format (newline-first, then comma)
- [ ] Add JSDoc comments
- [ ] Write unit tests for parser

#### CSV Parser Implementation

```typescript
/**
 * Parses a string of file names (supports newline or comma-delimited)
 * @param input - The input string to parse
 * @returns Array of file names (trimmed, no empties)
 */
export function parseCSV(input: string): string[] {
  if (!input || input.trim() === '') {
    return [];
  }
  
  // Try splitting by newlines first (handles line-delimited format)
  let fileNames = input.split(/\r?\n/).map(name => name.trim()).filter(name => name.length > 0);
  
  // If only one line, try comma-delimited format
  if (fileNames.length === 1 && fileNames[0].includes(',')) {
    fileNames = fileNames[0].split(',').map(name => name.trim()).filter(name => name.length > 0);
  }
  
  return fileNames;
}

/**
 * Validates CSV input format
 * @param csvString - The CSV string to validate
 * @returns Validation result with errors if any
 */
export function validateCSV(csvString: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!csvString || csvString.trim() === '') {
    errors.push('CSV input is empty');
  }
  
  // Add more validation as needed
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

#### Supported Formats

The parser should handle:

**Newline-delimited (preferred for large lists):**
```
file1.psarc
file2.psarc
file3.psarc
```

**Comma-delimited:**
```
file1.psarc, file2.psarc, file3.psarc
file1.psarc,file2.psarc,file3.psarc
file1.psarc  ,  file2.psarc  ,  file3.psarc
```

And filter out:
```
file1.psarc, , file2.psarc       // Empty entry in middle
file1.psarc, file2.psarc,        // Trailing comma
  , file1.psarc                  // Leading comma

file1.psarc

file2.psarc                      // Empty lines
```

#### Edge Cases to Handle

1. Empty string
2. Only whitespace
3. Only commas
4. Trailing commas
5. Leading commas
6. Multiple consecutive commas
7. Very long strings (thousands of files)

#### Unit Tests

```typescript
describe('parseCSV', () => {
  it('should parse newline-delimited string', () => {
    const result = parseCSV('file1.psarc\nfile2.psarc\nfile3.psarc');
    expect(result).toEqual(['file1.psarc', 'file2.psarc', 'file3.psarc']);
  });
  
  it('should parse comma-delimited string', () => {
    const result = parseCSV('file1.psarc, file2.psarc, file3.psarc');
    expect(result).toEqual(['file1.psarc', 'file2.psarc', 'file3.psarc']);
  });
  
  it('should handle no spaces in comma format', () => {
    const result = parseCSV('file1.psarc,file2.psarc');
    expect(result).toEqual(['file1.psarc', 'file2.psarc']);
  });
  
  it('should filter empty entries', () => {
    const result = parseCSV('file1.psarc, , file2.psarc');
    expect(result).toEqual(['file1.psarc', 'file2.psarc']);
  });
  
  it('should filter empty lines', () => {
    const result = parseCSV('file1.psarc\n\nfile2.psarc');
    expect(result).toEqual(['file1.psarc', 'file2.psarc']);
  });
  
  it('should return empty array for empty string', () => {
    const result = parseCSV('');
    expect(result).toEqual([]);
  });
});
```

#### Acceptance Criteria

- Parses newline-delimited strings correctly
- Parses comma-delimited strings correctly
- Auto-detects format intelligently
- Trims whitespace from file names
- Filters out empty entries and blank lines
- Handles edge cases gracefully
- Works with FileList.csv (1300+ newline-delimited entries)
- Returns empty array for invalid input
- No crashes on malformed input
- Unit tests achieve 100% coverage

#### Deliverables

- ✓ Complete `src/scripts/csvParser.ts`
- ✓ Comprehensive unit tests
- ✓ Documentation with examples

---

### ✅ Task 4.2: Implement Bulk Import UI

**Estimated Time**: 3 hours  
**Priority**: High  
**Dependencies**: Task 4.1  
**Status**: [ ] Not Started

#### Subtasks Checklist

- [ ] Get reference to CSV textarea and import button
- [ ] Add event listener for "Import" button
- [ ] Get CSV text from textarea
- [ ] Call CSV parser
- [ ] Add each file using data service
- [ ] Track import statistics (added, duplicates, errors)
- [ ] Display import summary
- [ ] Handle duplicate files (skip and count)
- [ ] Clear textarea after successful import
- [ ] Show progress for large imports (optional)

#### UI Implementation

```typescript
import { parseCSV } from './csvParser';
import { addFile } from './dataService';
import { renderFileList } from './renderer';

/**
 * Initializes bulk import functionality
 */
export function initializeBulkImport(): void {
  const textarea = document.getElementById('csv-input') as HTMLTextAreaElement;
  const importBtn = document.getElementById('import-btn') as HTMLButtonElement;
  
  importBtn.addEventListener('click', () => handleBulkImport(textarea));
  
  // Optional: keyboard shortcut
  textarea.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleBulkImport(textarea);
    }
  });
}

/**
 * Handles bulk import from CSV
 */
function handleBulkImport(textarea: HTMLTextAreaElement): void {
  const csvText = textarea.value;
  
  if (!csvText.trim()) {
    showMessage('Please enter file names to import', 'error');
    return;
  }
  
  const fileNames = parseCSV(csvText);
  
  if (fileNames.length === 0) {
    showMessage('No valid file names found in input', 'error');
    return;
  }
  
  // Import statistics
  let added = 0;
  let duplicates = 0;
  
  fileNames.forEach(fileName => {
    const result = addFile(fileName);
    if (result) {
      added++;
    } else {
      duplicates++;
    }
  });
  
  // Update UI
  renderFileList();
  textarea.value = '';
  
  // Show summary
  showImportSummary(added, duplicates, fileNames.length);
}

/**
 * Shows import summary message
 */
function showImportSummary(added: number, duplicates: number, total: number): void {
  let message = `Import complete: ${added} file(s) added`;
  if (duplicates > 0) {
    message += `, ${duplicates} duplicate(s) skipped`;
  }
  showMessage(message, 'success');
}
```

#### Import Summary Messages

- **Success (no duplicates)**: "Import complete: 10 file(s) added"
- **Success (with duplicates)**: "Import complete: 8 file(s) added, 2 duplicate(s) skipped"
- **No valid files**: "No valid file names found in input"
- **Empty input**: "Please enter file names to import"

#### Progress Indicator (Optional Enhancement)

For large imports (>100 files), show progress:
```typescript
function handleBulkImportWithProgress(fileNames: string[]): void {
  const total = fileNames.length;
  let processed = 0;
  
  // Show progress modal
  showProgressModal(0, total);
  
  // Process in chunks to avoid blocking UI
  const chunkSize = 50;
  processChunk(0);
  
  function processChunk(startIndex: number): void {
    const endIndex = Math.min(startIndex + chunkSize, total);
    
    for (let i = startIndex; i < endIndex; i++) {
      addFile(fileNames[i]);
      processed++;
    }
    
    updateProgress(processed, total);
    
    if (endIndex < total) {
      setTimeout(() => processChunk(endIndex), 10);
    } else {
      hideProgressModal();
      renderFileList();
    }
  }
}
```

#### Acceptance Criteria

- Import button triggers bulk import
- CSV is parsed correctly
- All valid files are added
- Duplicates are skipped and counted
- Import summary is displayed
- Textarea clears after successful import
- Large imports (100+ files) don't freeze UI
- Statistics are accurate
- User receives clear feedback

#### Deliverables

- ✓ Working bulk import functionality
- ✓ Import statistics and summary
- ✓ Clear user feedback
- ✓ Keyboard shortcut support (Ctrl/Cmd+Enter)

---

### ✅ Task 4.3: Add Search/Filter Functionality

**Estimated Time**: 4 hours  
**Priority**: Medium  
**Dependencies**: Task 2.3 (File List Renderer)  
**Status**: [ ] Not Started

#### Subtasks Checklist

- [ ] Add search input field to HTML (already exists)
- [ ] Implement live search filter
- [ ] Add status filter buttons
- [ ] Create `filterFiles()` function in data service
- [ ] Update renderer to show filtered results
- [ ] Display count of filtered results
- [ ] Add "Clear filters" button
- [ ] Highlight search matches (optional)
- [ ] Maintain filter state during operations

#### Data Service Filter Function

```typescript
/**
 * Filters files by search term and/or status
 * @param searchTerm - Text to search in file names (case-insensitive)
 * @param statusFilter - Status to filter by ('all' or specific status)
 * @returns Filtered array of files
 */
export function filterFiles(
  searchTerm: string = '',
  statusFilter: FileStatus | 'all' = 'all'
): RocksmithFile[] {
  let filtered = [...files];
  
  // Apply search filter
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(file => 
      file.fileName.toLowerCase().includes(term)
    );
  }
  
  // Apply status filter
  if (statusFilter !== 'all') {
    filtered = filtered.filter(file => file.status === statusFilter);
  }
  
  return filtered;
}
```

#### UI Implementation

```typescript
let currentSearchTerm = '';
let currentStatusFilter: FileStatus | 'all' = 'all';

/**
 * Initializes search and filter functionality
 */
export function initializeFilters(): void {
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  // Live search
  searchInput.addEventListener('input', (e) => {
    currentSearchTerm = (e.target as HTMLInputElement).value;
    renderFilteredFileList();
  });
  
  // Status filters
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update filter
      currentStatusFilter = button.dataset.status as FileStatus | 'all';
      renderFilteredFileList();
    });
  });
}

/**
 * Renders file list with current filters applied
 */
function renderFilteredFileList(): void {
  const filtered = filterFiles(currentSearchTerm, currentStatusFilter);
  renderFileListWithData(filtered);
  updateFilterCount(filtered.length, getFiles().length);
}

/**
 * Updates the filter count display
 */
function updateFilterCount(shown: number, total: number): void {
  const countElement = document.getElementById('filter-count');
  if (countElement) {
    if (shown === total) {
      countElement.textContent = `${total} file(s)`;
    } else {
      countElement.textContent = `Showing ${shown} of ${total} file(s)`;
    }
  }
}
```

#### Filter Count Display

Add to HTML:
```html
<div class="filter-info">
  <span id="filter-count"></span>
  <button id="clear-filters" style="display: none;">Clear Filters</button>
</div>
```

#### Filter Button Styling

```css
.filter-btn {
  padding: 8px 16px;
  margin: 0 4px;
  border: 1px solid var(--color-border);
  background: white;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background: var(--color-background);
}

.filter-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}
```

#### Search Highlighting (Optional)

```typescript
function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm) return escapeHtml(text);
  
  const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
  return escapeHtml(text).replace(regex, '<mark>$1</mark>');
}
```

#### Acceptance Criteria

- Search input filters files in real-time
- Search is case-insensitive
- Status filter buttons work correctly
- Active filter button is visually highlighted
- Filter count shows "X of Y files"
- Filters can be combined (search + status)
- Clear filters button resets all filters
- Filtering is fast (<100ms for 500 files)

#### Deliverables

- ✓ Live search functionality
- ✓ Status filter buttons
- ✓ Filter combination support
- ✓ Filter count display

---

### ✅ Task 4.4: UI Polish & Enhancements

**Estimated Time**: 4 hours  
**Priority**: Medium  
**Dependencies**: All previous tasks  
**Status**: [ ] Not Started

#### Subtasks Checklist

- [ ] Add loading states/spinners
- [ ] Improve error message styling
- [ ] Add tooltips for status indicators
- [ ] Implement smooth animations/transitions
- [ ] Add keyboard shortcuts
- [ ] Improve mobile responsiveness
- [ ] Add status count summary display
- [ ] Improve color scheme and typography
- [ ] Add focus states for accessibility
- [ ] Optimize button layouts

#### Loading States

Add loading indicator for bulk imports:
```html
<div id="loading-overlay" class="loading-overlay" style="display: none;">
  <div class="spinner"></div>
  <p>Importing files...</p>
</div>
```

```css
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

#### Toast Notifications

Replace basic alerts with styled toast notifications:
```html
<div id="toast-container" class="toast-container"></div>
```

```typescript
function showToast(message: string, type: 'success' | 'error' | 'info'): void {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  container?.appendChild(toast);
  
  // Animate in
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
```

#### Status Count Summary

Add visual summary of file counts by status:
```html
<div class="status-summary">
  <div class="summary-item">
    <span class="status-indicator status-good"></span>
    <span class="summary-count" id="count-good">0</span>
  </div>
  <div class="summary-item">
    <span class="status-indicator status-bad"></span>
    <span class="summary-count" id="count-bad">0</span>
  </div>
  <div class="summary-item">
    <span class="status-indicator status-wrongFormat"></span>
    <span class="summary-count" id="count-wrongFormat">0</span>
  </div>
  <div class="summary-item">
    <span class="status-indicator status-untested"></span>
    <span class="summary-count" id="count-untested">0</span>
  </div>
</div>
```

```typescript
function updateStatusCounts(): void {
  const files = getFiles();
  const counts = {
    good: 0,
    bad: 0,
    wrongFormat: 0,
    untested: 0
  };
  
  files.forEach(file => {
    counts[file.status]++;
  });
  
  document.getElementById('count-good')!.textContent = counts.good.toString();
  document.getElementById('count-bad')!.textContent = counts.bad.toString();
  document.getElementById('count-wrongFormat')!.textContent = counts.wrongFormat.toString();
  document.getElementById('count-untested')!.textContent = counts.untested.toString();
}
```

#### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Enter (in input) | Add file |
| Ctrl/Cmd + Enter (in textarea) | Import CSV |
| Esc | Clear current input |
| / | Focus search |

```typescript
document.addEventListener('keydown', (e) => {
  // Focus search on '/'
  if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
    e.preventDefault();
    document.getElementById('search-input')?.focus();
  }
  
  // Clear input on Esc
  if (e.key === 'Escape') {
    const activeElement = document.activeElement as HTMLInputElement;
    if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
      activeElement.value = '';
      activeElement.blur();
    }
  }
});
```

#### Transitions and Animations

Add smooth transitions:
```css
.file-entry {
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.file-entry:hover {
  background-color: #f5f5f5;
  transform: translateX(4px);
}

.file-entry.adding {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Mobile Responsiveness

Enhance mobile layout:
```css
@media (max-width: 768px) {
  .file-entry {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .actions {
    width: 100%;
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
  }
  
  .filter-section {
    flex-direction: column;
  }
  
  .status-filters {
    flex-wrap: wrap;
    margin-top: 8px;
  }
}
```

#### Acceptance Criteria

- Loading indicators appear for long operations
- Toast notifications are styled and auto-dismiss
- Status summary updates in real-time
- Keyboard shortcuts work correctly
- Smooth transitions on all interactions
- Mobile layout is usable and attractive
- All interactive elements have focus states
- Typography is consistent and readable

#### Deliverables

- ✓ Loading states and spinners
- ✓ Toast notification system
- ✓ Status count summary
- ✓ Keyboard shortcuts
- ✓ Smooth animations
- ✓ Enhanced mobile responsiveness

---

## Sprint 4 Completion Checklist

### Task Completion
- [ ] Task 4.1: CSV parser implemented ✓
- [ ] Task 4.2: Bulk import UI working ✓
- [ ] Task 4.3: Search/filter functionality ✓
- [ ] Task 4.4: UI polish complete ✓

### Quality Checks
- [ ] Bulk import handles 100+ files smoothly
- [ ] Search is responsive and fast
- [ ] Filters work correctly
- [ ] All animations are smooth
- [ ] Mobile experience is polished
- [ ] Keyboard shortcuts work
- [ ] No console errors

### User Acceptance
- [ ] Bulk import is intuitive
- [ ] Search finds files quickly
- [ ] Filters are easy to use
- [ ] UI feels professional and polished
- [ ] Mobile interface is usable

### Performance
- [ ] Search filters in < 100ms
- [ ] Bulk import doesn't freeze UI
- [ ] Animations run at 60fps
- [ ] Page remains responsive with 500+ files

### End of Sprint Demo

Demonstrate:
1. Bulk import 50+ files via CSV
2. Search for specific files
3. Filter by status
4. Combine search and filter
5. Mobile responsiveness
6. Keyboard shortcuts
7. Status summary display

---

## MVP Feature Complete! 🎉

After Sprint 4, the application has all planned MVP features:
- ✅ Add files individually
- ✅ Bulk import via CSV
- ✅ Update file status
- ✅ Delete files
- ✅ Search files
- ✅ Filter by status
- ✅ Data persistence
- ✅ Polished UI

---

## Next Sprint Preview

**Sprint 5** will focus on:
- Comprehensive testing (80% coverage)
- Integration testing
- User acceptance testing
- Documentation
- Deployment

---

**Sprint Status**: Not Started  
**Last Updated**: February 5, 2026  
**Sprint Owner**: [Your Name]
