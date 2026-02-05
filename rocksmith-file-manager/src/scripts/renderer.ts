import { getFiles } from './dataService';
import type { RocksmithFile, FileStatus } from '../types/index';

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
 * Escapes HTML to prevent XSS
 * @param text - Text to escape
 * @returns Escaped HTML string
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
