import { initializeFileAddition, initializeBulkImport, initializeFilters } from './ui.js';
import { renderFileList, initializeStatusUpdate, initializeDelete, initializePagination } from './renderer.js';
import { loadData } from './storageService.js';
import { setFiles } from './dataService.js';

/**
 * Initializes the Rocksmith File Manager application
 */
function initializeApp(): void {
  console.log('Initializing Rocksmith File Manager...');
  
  // Load saved data from localStorage
  const savedFiles = loadData();
  if (savedFiles.length > 0) {
    setFiles(savedFiles);
    console.log(`Loaded ${savedFiles.length} files from storage`);
  }
  
  // Initialize UI components
  initializeFileAddition();
  initializeBulkImport();
  initializeFilters();
  initializePagination();
  initializeStatusUpdate();
  initializeDelete();
  
  // Render initial state
  renderFileList();
  
  console.log('Rocksmith File Manager initialized successfully');
}

// Initialize app when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
