import { addFile } from './dataService';
import { renderFileList } from './renderer';

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
