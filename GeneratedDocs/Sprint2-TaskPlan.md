# Sprint 2: Core Functionality

**Sprint Duration**: Days 6-10 (Week 2)  
**Sprint Goal**: Implement basic file management and display  
**Total Estimated Time**: 13 hours

---

## Sprint Overview

This sprint focuses on building the core functionality of the Rocksmith File Manager. By the end of this sprint, users should be able to add files individually, view them in a list with visual status indicators, and see a functional user interface with proper validation.

---

## Prerequisites

Before starting Sprint 2, ensure Sprint 1 is complete:
- ✓ Project structure is set up
- ✓ TypeScript is configured
- ✓ HTML structure is in place
- ✓ CSS framework is ready
- ✓ Type definitions are created

---

## Tasks

### ✅ Task 2.1: Implement Data Service

**Estimated Time**: 4 hours  
**Priority**: High  
**Dependencies**: Task 1.2 (Type Definitions)  
**Status**: [ ] Not Started

#### Subtasks Checklist

- [ ] Create `src/scripts/dataService.ts` file
- [ ] Implement in-memory data store (array of RocksmithFile objects)
- [ ] Create `addFile(fileName: string)` function
- [ ] Create `getFiles()` function to retrieve all files
- [ ] Create `getFileById(id: string)` function
- [ ] Implement UUID generation for file IDs
- [ ] Add duplicate detection logic
- [ ] Add JSDoc comments to all functions
- [ ] Export all public functions

#### Code Structure

```typescript
import { RocksmithFile, FileStatus } from '../types/index';

// In-memory data store
let files: RocksmithFile[] = [];

/**
 * Generates a unique identifier
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Adds a new file to the data store
 * @param fileName - Name of the file to add
 * @returns The newly created file or null if duplicate
 */
export function addFile(fileName: string): RocksmithFile | null {
  // Implementation here
}

/**
 * Retrieves all files from the data store
 * @returns Array of all files
 */
export function getFiles(): RocksmithFile[] {
  // Implementation here
}

/**
 * Retrieves a file by its ID
 * @param id - The file ID
 * @returns The file or undefined if not found
 */
export function getFileById(id: string): RocksmithFile | undefined {
  // Implementation here
}
```

#### Acceptance Criteria

- Data service exports all required functions
- `addFile()` creates new file with 'untested' default status
- `addFile()` returns null for duplicate file names
- `getFiles()` returns copy of files array (not reference)
- `getFileById()` correctly finds files by ID
- Each file gets a unique ID
- All functions have proper TypeScript types
- JSDoc comments are complete

#### Deliverables

- ✓ Complete `src/scripts/dataService.ts` with CRUD operations
- ✓ Documented functions with JSDoc
- ✓ UUID generation utility

#### Testing Notes

Although Sprint 5 covers comprehensive testing, consider writing basic tests now:
```typescript
// Example test
describe('addFile', () => {
  it('should add a new file with untested status', () => {
    const file = addFile('test.psarc');
    expect(file).toBeDefined();
    expect(file?.status).toBe('untested');
  });
});
```

---

### ✅ Task 2.2: Implement File Addition UI

**Estimated Time**: 3 hours  
**Priority**: High  
**Dependencies**: Task 2.1  
**Status**: [ ] Not Started

#### Subtasks Checklist

- [ ] Create `src/scripts/ui.ts` module
- [ ] Get reference to input field and add button
- [ ] Add event listener for "Add File" button click
- [ ] Add event listener for Enter key in input field
- [ ] Implement input validation (non-empty, trimmed)
- [ ] Call `addFile()` from data service
- [ ] Display success message on successful addition
- [ ] Display error message for duplicates or empty input
- [ ] Clear input field after successful addition
- [ ] Focus back on input field after addition
- [ ] Update file list display after adding file

#### Validation Rules

1. **File name must not be empty** (after trimming)
2. **File name should be trimmed** of leading/trailing whitespace
3. **Duplicate file names** should show warning message
4. **Special characters** are allowed (users may have various naming conventions)

#### Code Structure

```typescript
import { addFile } from './dataService';
import { renderFileList } from './renderer';

/**
 * Initializes the file addition UI
 */
export function initializeFileAddition(): void {
  const input = document.getElementById('file-name-input') as HTMLInputElement;
  const addBtn = document.getElementById('add-file-btn') as HTMLButtonElement;
  
  addBtn.addEventListener('click', handleAddFile);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAddFile();
  });
}

/**
 * Handles adding a file from the input field
 */
function handleAddFile(): void {
  // Implementation here
}

/**
 * Displays a message to the user
 * @param message - Message to display
 * @param type - 'success' | 'error' | 'info'
 */
function showMessage(message: string, type: 'success' | 'error' | 'info'): void {
  // Implementation here
}
```

#### User Messages

- **Success**: "File '{fileName}' added successfully!"
- **Error - Empty**: "Please enter a file name"
- **Error - Duplicate**: "File '{fileName}' already exists"

#### Acceptance Criteria

- Clicking "Add File" button adds the file
- Pressing Enter in input field adds the file
- Empty input shows error message
- Duplicate files show error message
- Input field clears after successful addition
- Success/error messages are displayed to user
- Focus returns to input field after addition
- File list updates to show new file

#### Deliverables

- ✓ Working file addition UI with validation
- ✓ Keyboard shortcut support (Enter key)
- ✓ User feedback messages

---

### ✅ Task 2.3: Create File List Renderer

**Estimated Time**: 4 hours  
**Priority**: High  
**Dependencies**: Task 2.2  
**Status**: [ ] Not Started

#### Subtasks Checklist

- [ ] Create `src/scripts/renderer.ts` module
- [ ] Implement `renderFileList()` function
- [ ] Generate HTML for each file entry
- [ ] Display file name and status indicator
- [ ] Add status icon based on file status
- [ ] Handle empty state (no files)
- [ ] Implement auto-refresh after data changes
- [ ] Add data attributes for file IDs
- [ ] Optimize rendering for large lists
- [ ] Add accessibility attributes (ARIA labels)

#### HTML Structure per File Entry

```html
<div class="file-entry" data-file-id="[unique-id]">
  <span class="status-indicator status-[status]" 
        role="img" 
        aria-label="Status: [status]"></span>
  <span class="file-name">[fileName]</span>
  <div class="actions">
    <!-- Status dropdown will be added in Sprint 3 -->
    <!-- Delete button will be added in Sprint 3 -->
  </div>
</div>
```

#### Code Structure

```typescript
import { getFiles } from './dataService';
import type { RocksmithFile, FileStatus } from '../types/index';

/**
 * Renders the complete file list
 */
export function renderFileList(): void {
  const fileListContainer = document.getElementById('file-list') as HTMLDivElement;
  const emptyState = document.getElementById('empty-state') as HTMLDivElement;
  const files = getFiles();
  
  if (files.length === 0) {
    fileListContainer.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }
  
  emptyState.style.display = 'none';
  fileListContainer.innerHTML = files.map(renderFileEntry).join('');
}

/**
 * Renders a single file entry
 * @param file - The file to render
 * @returns HTML string for the file entry
 */
function renderFileEntry(file: RocksmithFile): string {
  return `
    <div class="file-entry" data-file-id="${file.id}">
      <span class="status-indicator status-${file.status}" 
            role="img" 
            aria-label="Status: ${getStatusLabel(file.status)}">
      </span>
      <span class="file-name">${escapeHtml(file.fileName)}</span>
      <div class="actions">
        <!-- Actions will be added in Sprint 3 -->
      </div>
    </div>
  `;
}

/**
 * Gets a human-readable status label
 */
function getStatusLabel(status: FileStatus): string {
  // Implementation here
}

/**
 * Escapes HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

#### Empty State

When no files exist, display:
```html
<div class="empty-state">
  <p>No files added yet. Start by adding a file above.</p>
</div>
```

#### Acceptance Criteria

- File list renders all files from data service
- Each file displays correct status indicator
- File names are properly escaped (XSS protection)
- Empty state shows when no files exist
- Empty state hides when files are present
- Rendering is performant (< 100ms for 100 files)
- Accessibility attributes are present
- Data attributes allow for easy file identification

#### Deliverables

- ✓ Complete file list rendering functionality
- ✓ Empty state handling
- ✓ Accessibility features
- ✓ XSS protection

---

### ✅ Task 2.4: Create Status Indicators

**Estimated Time**: 2 hours  
**Priority**: High  
**Dependencies**: Task 2.3  
**Status**: [ ] Not Started

#### Subtasks Checklist

- [ ] Create CSS classes for each status icon
- [ ] Implement green circle for "good" status
- [ ] Implement red circle for "bad" status
- [ ] Implement red circle with diagonal line for "wrong format"
- [ ] Implement yellow circle for "untested" status
- [ ] Add accessibility labels (ARIA)
- [ ] Test color contrast for accessibility
- [ ] Add tooltips on hover (optional enhancement)
- [ ] Ensure indicators are visible on all backgrounds
- [ ] Test on different screen sizes

#### Status Indicator CSS

```css
/* Base status indicator */
.status-indicator {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: var(--spacing-sm);
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.status-indicator:hover {
  transform: scale(1.1);
}

/* Good status - green circle */
.status-good {
  background-color: var(--color-good);
}

/* Bad status - red circle */
.status-bad {
  background-color: var(--color-bad);
}

/* Wrong format - red circle with diagonal line */
.status-wrongFormat {
  background-color: var(--color-wrong-format);
  position: relative;
  overflow: hidden;
}

.status-wrongFormat::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -2px;
  right: -2px;
  height: 3px;
  background-color: white;
  transform: translateY(-50%) rotate(-45deg);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}

/* Untested status - yellow circle */
.status-untested {
  background-color: var(--color-untested);
}
```

#### Accessibility Considerations

Each status indicator should have:
1. `role="img"` attribute
2. Descriptive `aria-label`
3. Adequate color contrast (WCAG AA: 4.5:1 minimum)
4. Not rely solely on color (wrong format has visual pattern)

#### Status Labels

- `good` → "Status: Good - Working correctly"
- `bad` → "Status: Bad - Incorrect tablature"
- `wrongFormat` → "Status: Wrong Format - Bass only"
- `untested` → "Status: Untested - Not yet evaluated"

#### Acceptance Criteria

- All four status indicators render correctly
- Colors match specification (green, red, red with line, yellow)
- Wrong format indicator clearly shows diagonal line
- Indicators are visible on all backgrounds
- ARIA labels provide context for screen readers
- Color contrast meets WCAG AA standards
- Indicators scale properly on different screen sizes
- Hover effect provides visual feedback (optional)

#### Deliverables

- ✓ CSS for all four status indicator states
- ✓ Accessibility attributes
- ✓ Visual distinction between all states

#### Testing Checklist

- [ ] Test each status indicator visually
- [ ] Verify with color blindness simulator
- [ ] Test with screen reader
- [ ] Verify on mobile devices
- [ ] Check in light and dark environments

---

## Sprint 2 Integration Tasks

### Integration Task: Connect All Components

**Time**: 1 hour

- [ ] Create `src/scripts/app.ts` (preliminary version)
- [ ] Import and initialize all modules
- [ ] Set up DOM ready event listener
- [ ] Initialize file addition UI
- [ ] Render initial file list
- [ ] Test complete flow: add file → see in list

```typescript
import { initializeFileAddition } from './ui';
import { renderFileList } from './renderer';

/**
 * Application entry point
 */
function init(): void {
  initializeFileAddition();
  renderFileList();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
```

---

## Sprint 2 Completion Checklist

### Task Completion
- [ ] Task 2.1: Data service implemented ✓
- [ ] Task 2.2: File addition UI working ✓
- [ ] Task 2.3: File list renderer complete ✓
- [ ] Task 2.4: Status indicators styled ✓
- [ ] Integration complete ✓

### Quality Checks
- [ ] All TypeScript compiles without errors
- [ ] No console errors in browser
- [ ] Can add files successfully
- [ ] Duplicate detection works
- [ ] File list displays correctly
- [ ] All four status indicators visible
- [ ] Empty state displays when appropriate
- [ ] Input validation works correctly

### User Acceptance
- [ ] User can add a file in < 3 seconds
- [ ] Error messages are clear and helpful
- [ ] UI is responsive and intuitive
- [ ] Status indicators are easily distinguishable

### Documentation
- [ ] Code comments added
- [ ] Git commits are descriptive
- [ ] Sprint retrospective notes captured

### End of Sprint Demo

Demonstrate:
1. Adding a single file
2. Seeing it appear in the list with "untested" status
3. Trying to add duplicate (shows error)
4. Empty input validation
5. All four status indicator styles (manually set in data)

---

## Known Limitations (To Address in Later Sprints)

- Files cannot be updated or deleted yet (Sprint 3)
- Status is always "untested" for new files (Sprint 3)
- No data persistence (refreshing loses data) (Sprint 3)
- No bulk import functionality (Sprint 4)
- No search/filter capability (Sprint 4)

---

## Troubleshooting

### File not appearing after adding
- Check that `renderFileList()` is called after `addFile()`
- Verify data service is returning the file
- Check browser console for errors

### Status indicators not showing
- Verify CSS file is loaded
- Check that status class names match in CSS and HTML
- Inspect element to verify correct class is applied

### Duplicate detection not working
- Check that file name comparison is case-sensitive/insensitive as desired
- Verify trimming is happening before comparison

---

## Next Sprint Preview

**Sprint 3** will add:
- Status update functionality (dropdown to change status)
- Data persistence with localStorage
- Delete file functionality
- Application initialization with saved data

---

**Sprint Status**: Not Started  
**Last Updated**: February 5, 2026  
**Sprint Owner**: [Your Name]
