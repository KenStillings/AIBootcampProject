import { getFiles, getFileById, updateFileStatus } from './dataService.js';
import { showMessage } from './ui.js';
import { paginationService } from './paginationService.js';
import type { RocksmithFile, FileStatus } from '../types/index.js';

/**
 * Renders the complete file list
 */
export function renderFileList(): void {
  const fileListContainer = document.getElementById('file-list') as HTMLDivElement;
  const emptyState = document.getElementById('empty-state') as HTMLDivElement;
  
  if (!fileListContainer || !emptyState) {
    console.error('File list container or empty state element not found');
    return;
  }

  const files = getFiles();
  
  if (files.length === 0) {
    fileListContainer.innerHTML = '';
    emptyState.style.display = 'block';
    renderPaginationControls(0);
    return;
  }
  
  // Initialize pagination with total file count
  paginationService.initialize(files.length);
  
  // Get current page slice
  const pageFiles = paginationService.getCurrentPageSlice(files);
  
  emptyState.style.display = 'none';
  fileListContainer.innerHTML = pageFiles.map(renderFileEntry).join('');
  
  // Render pagination controls
  renderPaginationControls(files.length);
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
        <select class="status-select" data-file-id="${file.id}" aria-label="Change status for ${escapeHtml(file.fileName)}">
          <option value="good" ${file.status === 'good' ? 'selected' : ''}>Good</option>
          <option value="bad" ${file.status === 'bad' ? 'selected' : ''}>Bad</option>
          <option value="wrongFormat" ${file.status === 'wrongFormat' ? 'selected' : ''}>Wrong Format</option>
          <option value="untested" ${file.status === 'untested' ? 'selected' : ''}>Untested</option>
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

/**
 * Gets a human-readable status label
 * @param status - The file status
 * @returns Human-readable status label
 */
function getStatusLabel(status: FileStatus): string {
  const labels: Record<FileStatus, string> = {
    'good': 'Good',
    'bad': 'Bad',
    'wrongFormat': 'Wrong Format',
    'untested': 'Untested'
  };
  return labels[status];
}

/**
 * Initializes status update event listeners
 */
export function initializeStatusUpdate(): void {
  const fileList = document.getElementById('file-list') as HTMLDivElement;
  
  if (!fileList) {
    console.error('File list element not found');
    return;
  }
  
  fileList.addEventListener('change', (event) => {
    const target = event.target as HTMLSelectElement;
    if (target.classList.contains('status-select')) {
      handleStatusChange(target);
    }
  });
}

/**
 * Handles status change from dropdown
 * @param select - The select element that triggered the change
 */
function handleStatusChange(select: HTMLSelectElement): void {
  const fileId = select.dataset.fileId;
  if (!fileId) return;
  
  const newStatus = select.value as FileStatus;
  const file = getFileById(fileId);
  
  if (!file) {
    showMessage('File not found', 'error');
    return;
  }
  
  const success = updateFileStatus(fileId, newStatus);
  if (success) {
    renderFileList();
    showMessage(`Status updated to ${getStatusLabel(newStatus)}`, 'success');
  } else {
    showMessage('Failed to update status', 'error');
  }
}

/**
 * Initializes delete event listeners
 */
export function initializeDelete(): void {
  const fileList = document.getElementById('file-list') as HTMLDivElement;
  
  if (!fileList) {
    console.error('File list element not found');
    return;
  }
  
  fileList.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('delete-btn')) {
      handleDelete(target);
    }
  });
}

/**
 * Handles file deletion with confirmation
 * @param button - The delete button that was clicked
 */
function handleDelete(button: HTMLElement): void {
  const fileId = button.dataset.fileId;
  if (!fileId) return;
  
  const file = getFileById(fileId);
  if (!file) return;
  
  const confirmed = confirm(`Are you sure you want to delete "${file.fileName}"?`);
  if (!confirmed) return;
  
  const { deleteFile } = require('./dataService');
  const success = deleteFile(fileId);
  if (success) {
    renderFileList();
    showMessage(`File "${file.fileName}" deleted`, 'success');
  } else {
    showMessage('Failed to delete file', 'error');
  }
}

/**
 * Renders a filtered file list
 * @param filteredFiles - Array of files to render
 */
export function renderFilteredFileList(filteredFiles: RocksmithFile[]): void {
  const fileListContainer = document.getElementById('file-list') as HTMLDivElement;
  const emptyState = document.getElementById('empty-state') as HTMLDivElement;
  
  if (!fileListContainer || !emptyState) {
    console.error('File list container or empty state element not found');
    return;
  }
  
  if (filteredFiles.length === 0) {
    fileListContainer.innerHTML = '';
    emptyState.style.display = 'block';
    emptyState.innerHTML = '<p>No files match your filters.</p>';
    renderPaginationControls(0);
    return;
  }
  
  // Initialize pagination with filtered file count
  paginationService.initialize(filteredFiles.length);
  
  // Get current page slice
  const pageFiles = paginationService.getCurrentPageSlice(filteredFiles);
  
  emptyState.style.display = 'none';
  fileListContainer.innerHTML = pageFiles.map(renderFileEntry).join('');
  
  // Render pagination controls
  renderPaginationControls(filteredFiles.length);
}

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

/**
 * Escapes HTML to prevent XSS
 * @param text - Text to escape
 * @returns Escaped HTML string
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
