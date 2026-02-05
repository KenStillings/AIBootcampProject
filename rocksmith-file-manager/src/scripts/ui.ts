import { addFile, getFiles, filterFiles } from './dataService.js';
import { renderFileList, renderFilteredFileList } from './renderer.js';
import { parseCSV } from './csvParser.js';
import { paginationService } from './paginationService.js';

/**
 * Initializes the file addition UI
 */
export function initializeFileAddition(): void {
  const input = document.getElementById('file-name-input') as HTMLInputElement;
  const addBtn = document.getElementById('add-file-btn') as HTMLButtonElement;
  
  if (!input || !addBtn) {
    console.error('File addition UI elements not found');
    return;
  }

  addBtn.addEventListener('click', handleAddFile);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleAddFile();
    }
  });
}

/**
 * Handles adding a file from the input field
 */
function handleAddFile(): void {
  const input = document.getElementById('file-name-input') as HTMLInputElement;
  const fileName = input.value.trim();

  if (!fileName) {
    showMessage('Please enter a file name', 'error');
    return;
  }

  const newFile = addFile(fileName);
  
  if (!newFile) {
    showMessage(`File '${fileName}' already exists`, 'error');
    return;
  }

  showMessage(`File '${fileName}' added successfully!`, 'success');
  input.value = '';
  input.focus();
  renderFileList();
}

/**
 * Displays a message to the user using toast notifications
 * @param message - Message to display
 * @param type - 'success' | 'error' | 'info'
 */
export function showMessage(message: string, type: 'success' | 'error' | 'info'): void {
  const toastContainer = document.getElementById('toast-container');
  
  if (!toastContainer) {
    console.error('Toast container not found');
    return;
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.setAttribute('role', 'alert');

  toastContainer.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

/**
 * Initializes bulk import functionality
 */
export function initializeBulkImport(): void {
  const textarea = document.getElementById('csv-input') as HTMLTextAreaElement;
  const importBtn = document.getElementById('import-btn') as HTMLButtonElement;
  
  if (!textarea || !importBtn) {
    console.error('Bulk import UI elements not found');
    return;
  }

  importBtn.addEventListener('click', () => handleBulkImport(textarea));
  
  // Keyboard shortcut: Ctrl/Cmd+Enter to import
  textarea.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleBulkImport(textarea);
    }
  });
}

/**
 * Handles bulk import from CSV/text input
 */
function handleBulkImport(textarea: HTMLTextAreaElement): void {
  const inputText = textarea.value;
  
  if (!inputText.trim()) {
    showMessage('Please enter file names to import', 'error');
    return;
  }
  
  const fileNames = parseCSV(inputText);
  
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
  showImportSummary(added, duplicates);
}

/**
 * Shows import summary message
 */
function showImportSummary(added: number, duplicates: number): void {
  let message = `Import complete: ${added} file(s) added`;
  if (duplicates > 0) {
    message += `, ${duplicates} duplicate(s) skipped`;
  }
  showMessage(message, 'success');
}

/**
 * Initializes search and filter functionality
 */
export function initializeFilters(): void {
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  if (!searchInput) {
    console.error('Search input not found');
    return;
  }
  
  // Live search
  searchInput.addEventListener('input', () => {
    applyFilters();
  });
  
  // Status filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Apply filters
      applyFilters();
    });
  });
  
  // Keyboard shortcut: '/' to focus search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
      e.preventDefault();
      searchInput.focus();
    }
  });
}

/**
 * Applies current search and filter settings
 */
function applyFilters(): void {
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const activeFilter = document.querySelector('.filter-btn.active') as HTMLButtonElement;
  
  const searchTerm = searchInput?.value || '';
  const statusFilter = activeFilter?.dataset.status || 'all';
  
  // Reset pagination to first page when filters change
  paginationService.reset();
  
  const filtered = filterFiles(searchTerm, statusFilter as any);
  const total = getFiles().length;
  
  renderFilteredFileList(filtered);
  updateFilterCount(filtered.length, total);
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
