# Sprint 3: Status Management & Persistence

**Sprint Duration**: Days 11-15 (Week 3)  
**Sprint Goal**: Add status updates, data persistence, and unit tests  
**Total Estimated Time**: 14 hours

---

## Sprint Overview

This sprint focuses on making the application fully functional with the ability to update file statuses and persist data across browser sessions. By the end of this sprint, the Rocksmith File Manager will be a usable MVP with all core CRUD operations and data persistence.

---

## Prerequisites

Before starting Sprint 3, ensure Sprint 2 is complete:
- ✓ Data service is functional
- ✓ Files can be added
- ✓ File list renders correctly
- ✓ Status indicators display properly

---

## Tasks

### ✅ Task 3.1: Implement Status Update Functionality

**Estimated Time**: 4 hours  
**Priority**: High  
**Dependencies**: Task 2.3 (File List Renderer)  
**Status**: [ ] Not Started

#### Subtasks Checklist

- [ ] Add `updateStatus(id: string, newStatus: FileStatus)` to data service
- [ ] Update `lastModified` timestamp in updateStatus function
- [ ] Create status dropdown for each file entry
- [ ] Add event listeners for status changes
- [ ] Re-render file entry on status update
- [ ] Add visual feedback (animation/highlight) for successful update
- [ ] Handle invalid status values
- [ ] Export updateStatus from data service

#### Data Service Update

```typescript
/**
 * Updates the status of a file
 * @param id - The file ID
 * @param newStatus - The new status to set
 * @returns True if updated successfully, false if file not found
 */
export function updateStatus(id: string, newStatus: FileStatus): boolean {
  const file = files.find(f => f.id === id);
  if (!file) return false;
  
  file.status = newStatus;
  file.lastModified = new Date();
  return true;
}
```

#### UI Implementation

Update `renderFileEntry` to include status dropdown:

```typescript
function renderFileEntry(file: RocksmithFile): string {
  return `
    <div class="file-entry" data-file-id="${file.id}">
      <span class="status-indicator status-${file.status}" 
            role="img" 
            aria-label="Status: ${getStatusLabel(file.status)}">
      </span>
      <span class="file-name">${escapeHtml(file.fileName)}</span>
      <div class="actions">
        <select class="status-select" data-file-id="${file.id}" aria-label="Change status">
          <option value="good" ${file.status === 'good' ? 'selected' : ''}>Good</option>
          <option value="bad" ${file.status === 'bad' ? 'selected' : ''}>Bad</option>
          <option value="wrongFormat" ${file.status === 'wrongFormat' ? 'selected' : ''}>Wrong Format</option>
          <option value="untested" ${file.status === 'untested' ? 'selected' : ''}>Untested</option>
        </select>
      </div>
    </div>
  `;
}
```

#### Event Handling

```typescript
/**
 * Initializes status update event listeners
 */
export function initializeStatusUpdate(): void {
  const fileList = document.getElementById('file-list') as HTMLDivElement;
  
  fileList.addEventListener('change', (event) => {
    const target = event.target as HTMLSelectElement;
    if (target.classList.contains('status-select')) {
      handleStatusChange(target);
    }
  });
}

/**
 * Handles status change from dropdown
 */
function handleStatusChange(select: HTMLSelectElement): void {
  const fileId = select.dataset.fileId!;
  const newStatus = select.value as FileStatus;
  
  const success = updateStatus(fileId, newStatus);
  if (success) {
    // Re-render just this file entry or entire list
    renderFileList();
    showMessage(`Status updated to ${getStatusLabel(newStatus)}`, 'success');
  } else {
    showMessage('Failed to update status', 'error');
  }
}
```

#### Acceptance Criteria

- Status dropdown appears for each file
- Current status is pre-selected in dropdown
- Changing status updates the file immediately
- Status indicator changes to reflect new status
- `lastModified` timestamp is updated
- Visual feedback confirms successful update
- Invalid status values are rejected
- All four status options are available

#### Deliverables

- ✓ `updateStatus()` function in data service
- ✓ Status dropdown in file entries
- ✓ Event handling for status changes
- ✓ Visual feedback for updates

---

### ✅ Task 3.2: Implement Local Storage Persistence

**Estimated Time**: 3 hours  
**Priority**: High  
**Dependencies**: Task 3.1  
**Status**: [ ] Not Started

#### Subtasks Checklist

- [ ] Create `src/scripts/storageService.ts`
- [ ] Implement `saveData(files: RocksmithFile[])` function
- [ ] Implement `loadData()` function
- [ ] Handle Date serialization (convert Date to ISO string)
- [ ] Handle Date deserialization (convert ISO string back to Date)
- [ ] Add error handling for storage quota exceeded
- [ ] Add error handling for corrupted data
- [ ] Implement auto-save on every data change
- [ ] Add storage key constant
- [ ] Test with large datasets

#### Storage Service Implementation

```typescript
import type { RocksmithFile } from '../types/index';

const STORAGE_KEY = 'rocksmith-file-manager-data';

/**
 * Saves files to localStorage
 * @param files - Array of files to save
 * @returns True if saved successfully, false otherwise
 */
export function saveData(files: RocksmithFile[]): boolean {
  try {
    // Convert Dates to ISO strings for JSON serialization
    const serializedFiles = files.map(file => ({
      ...file,
      dateAdded: file.dateAdded.toISOString(),
      lastModified: file.lastModified?.toISOString()
    }));
    
    const jsonData = JSON.stringify(serializedFiles);
    localStorage.setItem(STORAGE_KEY, jsonData);
    return true;
  } catch (error) {
    console.error('Failed to save data:', error);
    // Check if quota exceeded
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Please remove some files.');
    }
    return false;
  }
}

/**
 * Loads files from localStorage
 * @returns Array of files or empty array if no data/error
 */
export function loadData(): RocksmithFile[] {
  try {
    const jsonData = localStorage.getItem(STORAGE_KEY);
    if (!jsonData) return [];
    
    const serializedFiles = JSON.parse(jsonData);
    
    // Convert ISO strings back to Dates
    const files = serializedFiles.map((file: any) => ({
      ...file,
      dateAdded: new Date(file.dateAdded),
      lastModified: file.lastModified ? new Date(file.lastModified) : undefined
    }));
    
    return files;
  } catch (error) {
    console.error('Failed to load data:', error);
    return [];
  }
}

/**
 * Clears all data from localStorage
 */
export function clearData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
```

#### Integration with Data Service

Update `dataService.ts` to auto-save:

```typescript
import { saveData } from './storageService';

// Call saveData after any mutation
export function addFile(fileName: string): RocksmithFile | null {
  // ... existing code ...
  files.push(newFile);
  saveData(files);  // Auto-save
  return newFile;
}

export function updateStatus(id: string, newStatus: FileStatus): boolean {
  // ... existing code ...
  file.status = newStatus;
  file.lastModified = new Date();
  saveData(files);  // Auto-save
  return true;
}
```

#### Error Handling

Handle these scenarios:
1. **Storage quota exceeded**: Alert user, prevent save
2. **Corrupted data**: Return empty array, log error
3. **No data**: Return empty array (first-time user)
4. **JSON parse error**: Return empty array, log error

#### Acceptance Criteria

- Data saves to localStorage after every change
- Data loads correctly on application start
- Date objects are properly serialized/deserialized
- Storage quota errors are handled gracefully
- Corrupted data doesn't crash the application
- Large datasets (500+ files) save and load successfully
- No data loss occurs during save/load operations

#### Deliverables

- ✓ Complete `src/scripts/storageService.ts`
- ✓ Auto-save integration
- ✓ Robust error handling
- ✓ Date serialization/deserialization

---

### ✅ Task 3.3: Implement Application Initialization

**Estimated Time**: 2 hours  
**Priority**: High  
**Dependencies**: Task 3.2  
**Status**: [ ] Not Started

#### Subtasks Checklist

- [ ] Update `src/scripts/app.ts` with initialization logic
- [ ] Implement `init()` function
- [ ] Load data from localStorage on startup
- [ ] Populate data service with loaded data
- [ ] Initialize all event listeners
- [ ] Render initial file list
- [ ] Handle first-time user experience (empty state)
- [ ] Handle data migration (if schema changes in future)
- [ ] Add loading indicator (optional)

#### Application Initialization

```typescript
import { initializeFileAddition } from './ui';
import { initializeStatusUpdate } from './renderer';
import { renderFileList } from './renderer';
import { loadData } from './storageService';
import { setFiles } from './dataService';

/**
 * Application entry point
 */
function init(): void {
  console.log('Initializing Rocksmith File Manager...');
  
  // Load saved data
  const savedFiles = loadData();
  if (savedFiles.length > 0) {
    setFiles(savedFiles);
    console.log(`Loaded ${savedFiles.length} files from storage`);
  }
  
  // Initialize UI components
  initializeFileAddition();
  initializeStatusUpdate();
  
  // Render initial state
  renderFileList();
  
  console.log('Application initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
```

#### Data Service Update

Add `setFiles()` function to data service:

```typescript
/**
 * Sets the files array (used for initialization)
 * @param newFiles - Array of files to set
 */
export function setFiles(newFiles: RocksmithFile[]): void {
  files = [...newFiles];
}
```

#### First-Time User Experience

When no data exists:
1. Display empty state message
2. Provide helpful instructions
3. Don't show error messages
4. Ensure smooth onboarding

#### Acceptance Criteria

- Application loads saved data on startup
- Data service is populated with loaded files
- File list renders immediately on page load
- First-time users see empty state (not errors)
- All event listeners are initialized
- Console logs provide helpful initialization feedback
- No errors in browser console during init
- Page loads in < 2 seconds

#### Deliverables

- ✓ Complete application initialization logic
- ✓ Data loading on startup
- ✓ Smooth first-time user experience

---

### ✅ Task 3.4: Add Delete Functionality

**Estimated Time**: 2 hours  
**Priority**: Medium  
**Dependencies**: Task 3.1  
**Status**: [ ] Not Started

#### Subtasks Checklist

- [ ] Add `deleteFile(id: string)` to data service
- [ ] Add delete button to each file entry
- [ ] Implement confirmation dialog before deletion
- [ ] Remove file from data array
- [ ] Save changes to localStorage
- [ ] Re-render file list after deletion
- [ ] Show confirmation message
- [ ] Handle keyboard interaction (keyboard accessible)
- [ ] Add delete button styling

#### Data Service Update

```typescript
/**
 * Deletes a file from the data store
 * @param id - The file ID to delete
 * @returns True if deleted successfully, false if not found
 */
export function deleteFile(id: string): boolean {
  const index = files.findIndex(f => f.id === id);
  if (index === -1) return false;
  
  files.splice(index, 1);
  saveData(files);  // Auto-save
  return true;
}
```

#### UI Implementation

Update `renderFileEntry` to include delete button:

```typescript
function renderFileEntry(file: RocksmithFile): string {
  return `
    <div class="file-entry" data-file-id="${file.id}">
      <span class="status-indicator status-${file.status}" 
            role="img" 
            aria-label="Status: ${getStatusLabel(file.status)}">
      </span>
      <span class="file-name">${escapeHtml(file.fileName)}</span>
      <div class="actions">
        <select class="status-select" data-file-id="${file.id}" aria-label="Change status">
          <!-- Status options -->
        </select>
        <button class="delete-btn" 
                data-file-id="${file.id}" 
                aria-label="Delete ${escapeHtml(file.fileName)}"
                title="Delete file">
          🗑️
        </button>
      </div>
    </div>
  `;
}
```

#### Event Handling

```typescript
/**
 * Initializes delete event listeners
 */
export function initializeDelete(): void {
  const fileList = document.getElementById('file-list') as HTMLDivElement;
  
  fileList.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('delete-btn')) {
      handleDelete(target);
    }
  });
}

/**
 * Handles file deletion with confirmation
 */
function handleDelete(button: HTMLElement): void {
  const fileId = button.dataset.fileId!;
  const file = getFileById(fileId);
  
  if (!file) return;
  
  const confirmed = confirm(`Are you sure you want to delete "${file.fileName}"?`);
  if (!confirmed) return;
  
  const success = deleteFile(fileId);
  if (success) {
    renderFileList();
    showMessage(`File "${file.fileName}" deleted`, 'success');
  } else {
    showMessage('Failed to delete file', 'error');
  }
}
```

#### Delete Button Styling

```css
.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 4px 8px;
  margin-left: 8px;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.delete-btn:hover {
  opacity: 1;
}

.delete-btn:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

#### Acceptance Criteria

- Delete button appears for each file
- Clicking delete shows confirmation dialog
- Confirming deletes the file
- Canceling does not delete the file
- File is removed from data store and localStorage
- File list re-renders after deletion
- Success message is shown
- Button is keyboard accessible
- ARIA labels are present

#### Deliverables

- ✓ `deleteFile()` function in data service
- ✓ Delete button in file entries
- ✓ Confirmation dialog
- ✓ Complete delete functionality

---

### ✅ Task 3.5: Unit Tests for Sprint 3 Features

**Estimated Time**: 3 hours  
**Priority**: High  
**Dependencies**: Tasks 3.1-3.4  
**Status**: [ ] Not Started

#### Subtasks Checklist

- [ ] Create `tests/dataService.test.ts`
- [ ] Test `updateFileStatus()` function
- [ ] Test `deleteFile()` function
- [ ] Test `setFiles()` function
- [ ] Create `tests/storageService.test.ts`
- [ ] Test `saveData()` function with mock localStorage
- [ ] Test `loadData()` function with valid data
- [ ] Test `loadData()` with corrupted data
- [ ] Test Date serialization/deserialization
- [ ] Test storage quota error handling
- [ ] Create `tests/integration.test.ts`
- [ ] Test full data flow (add → update → save → load)
- [ ] Run tests and verify coverage
- [ ] Aim for 80%+ coverage on Sprint 3 code

#### Data Service Tests

**tests/dataService.test.ts**:
```typescript
import { updateFileStatus, deleteFile, setFiles, getFiles, addFile } from '../src/scripts/dataService';
import type { FileStatus } from '../src/types/index';

describe('dataService', () => {
  beforeEach(() => {
    // Clear data before each test
    setFiles([]);
  });

  describe('updateFileStatus', () => {
    it('should update file status', () => {
      const file = addFile('test.psarc');
      const result = updateFileStatus(file!.id, 'good');
      
      expect(result).toBe(true);
      const files = getFiles();
      expect(files[0].status).toBe('good');
    });

    it('should update lastModified timestamp', () => {
      const file = addFile('test.psarc');
      const originalTime = file!.lastModified;
      
      // Wait a bit
      setTimeout(() => {
        updateFileStatus(file!.id, 'bad');
        const files = getFiles();
        expect(files[0].lastModified.getTime()).toBeGreaterThan(originalTime.getTime());
      }, 10);
    });

    it('should return false for non-existent file', () => {
      const result = updateFileStatus('non-existent-id', 'good');
      expect(result).toBe(false);
    });
  });

  describe('deleteFile', () => {
    it('should delete file by id', () => {
      const file = addFile('test.psarc');
      const result = deleteFile(file!.id);
      
      expect(result).toBe(true);
      expect(getFiles()).toHaveLength(0);
    });

    it('should return false for non-existent file', () => {
      const result = deleteFile('non-existent-id');
      expect(result).toBe(false);
    });
  });

  describe('setFiles', () => {
    it('should replace files array', () => {
      addFile('file1.psarc');
      addFile('file2.psarc');
      
      const newFiles = [{
        id: '123',
        fileName: 'new.psarc',
        status: 'good' as FileStatus,
        dateAdded: new Date(),
        lastModified: new Date()
      }];
      
      setFiles(newFiles);
      expect(getFiles()).toHaveLength(1);
      expect(getFiles()[0].fileName).toBe('new.psarc');
    });
  });
});
```

#### Storage Service Tests

**tests/storageService.test.ts**:
```typescript
import { saveData, loadData, clearData } from '../src/scripts/storageService';
import type { RocksmithFile } from '../src/types/index';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

global.localStorage = localStorageMock as Storage;

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveData', () => {
    it('should save files to localStorage', () => {
      const files: RocksmithFile[] = [{
        id: '123',
        fileName: 'test.psarc',
        status: 'untested',
        dateAdded: new Date('2026-01-01'),
        lastModified: new Date('2026-01-01')
      }];

      const result = saveData(files);
      expect(result).toBe(true);
      expect(localStorage.getItem('rocksmith-file-manager-data')).toBeTruthy();
    });

    it('should serialize Dates to ISO strings', () => {
      const files: RocksmithFile[] = [{
        id: '123',
        fileName: 'test.psarc',
        status: 'untested',
        dateAdded: new Date('2026-01-01T00:00:00.000Z'),
        lastModified: new Date('2026-01-01T00:00:00.000Z')
      }];

      saveData(files);
      const saved = localStorage.getItem('rocksmith-file-manager-data');
      expect(saved).toContain('2026-01-01T00:00:00.000Z');
    });
  });

  describe('loadData', () => {
    it('should load files from localStorage', () => {
      const files: RocksmithFile[] = [{
        id: '123',
        fileName: 'test.psarc',
        status: 'good',
        dateAdded: new Date('2026-01-01'),
        lastModified: new Date('2026-01-01')
      }];

      saveData(files);
      const loaded = loadData();
      
      expect(loaded).toHaveLength(1);
      expect(loaded[0].fileName).toBe('test.psarc');
      expect(loaded[0].status).toBe('good');
    });

    it('should deserialize ISO strings to Dates', () => {
      const files: RocksmithFile[] = [{
        id: '123',
        fileName: 'test.psarc',
        status: 'untested',
        dateAdded: new Date('2026-01-01'),
        lastModified: new Date('2026-01-01')
      }];

      saveData(files);
      const loaded = loadData();
      
      expect(loaded[0].dateAdded).toBeInstanceOf(Date);
      expect(loaded[0].lastModified).toBeInstanceOf(Date);
    });

    it('should return empty array for no data', () => {
      const loaded = loadData();
      expect(loaded).toEqual([]);
    });

    it('should handle corrupted data gracefully', () => {
      localStorage.setItem('rocksmith-file-manager-data', 'invalid json');
      const loaded = loadData();
      expect(loaded).toEqual([]);
    });
  });
});
```

#### Acceptance Criteria

- All Sprint 3 functions have unit tests
- Tests cover happy paths and error cases
- localStorage is properly mocked
- Date serialization is tested
- Test coverage is 80%+ for Sprint 3 code
- All tests pass
- Tests run in < 5 seconds

#### Deliverables

- ✓ Complete test suite for Sprint 3 features
- ✓ 80%+ test coverage
- ✓ All tests passing

---

## Sprint 3 Integration Tasks

### Integration Task: Complete App Initialization

**Time**: 30 minutes

Update `app.ts` to initialize all components:

```typescript
function init(): void {
  // Load saved data
  const savedFiles = loadData();
  if (savedFiles.length > 0) {
    setFiles(savedFiles);
  }
  
  // Initialize all UI components
  initializeFileAddition();
  initializeStatusUpdate();
  initializeDelete();
  
  // Render initial state
  renderFileList();
}
```

---

## Sprint 3 Completion Checklist

### Task Completion
- [ ] Task 3.1: Status update functionality ✓
- [ ] Task 3.2: Local storage persistence ✓
- [ ] Task 3.3: Application initialization ✓
- [ ] Task 3.4: Delete functionality ✓
- [ ] Task 3.5: Unit tests for Sprint 3 ✓

### Quality Checks
- [ ] All CRUD operations work (Create, Read, Update, Delete)
- [ ] Data persists across browser refreshes
- [ ] Status updates save to localStorage
- [ ] Deletions persist after refresh
- [ ] No console errors
- [ ] TypeScript compiles without errors
- [ ] All event listeners work correctly

### User Acceptance
- [ ] User can update file status
- [ ] User can delete files
- [ ] Data persists between sessions
- [ ] Confirmation dialogs prevent accidental deletion
- [ ] All operations complete in < 1 second

### Data Integrity
- [ ] No data loss on page refresh
- [ ] Dates serialize/deserialize correctly
- [ ] Large datasets (100+ files) work properly
- [ ] Storage quota errors are handled

### End of Sprint Demo

Demonstrate:
1. Add several files
2. Update their statuses
3. Delete a file (with confirmation)
4. Refresh the page
5. Verify all data persists correctly

---

## Known Limitations (To Address in Later Sprints)

- No bulk import functionality (Sprint 4)
- No search/filter capability (Sprint 4)
- No export functionality (Future)
- No undo/redo (Future)

---

## Troubleshooting

### Data not persisting
- Check localStorage in browser DevTools (Application tab)
- Verify `saveData()` is called after mutations
- Check for console errors during save

### Dates showing as strings
- Verify deserialization converts ISO strings to Date objects
- Check that `new Date()` is called in `loadData()`

### Delete confirmation not showing
- Verify `confirm()` is being called
- Check browser settings (dialogs may be blocked)

---

## Next Sprint Preview

**Sprint 4** will add:
- CSV parser for bulk import
- Bulk import UI
- Search/filter functionality
- UI polish and enhancements

---

**Sprint Status**: Not Started  
**Last Updated**: February 5, 2026  
**Sprint Owner**: [Your Name]
