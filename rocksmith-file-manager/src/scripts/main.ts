import { initializeFileAddition } from './ui';
import { renderFileList } from './renderer';

/**
 * Initializes the Rocksmith File Manager application
 */
function initializeApp(): void {
  console.log('Initializing Rocksmith File Manager...');
  
  // Initialize file addition UI
  initializeFileAddition();
  
  // Render initial empty state
  renderFileList();
  
  console.log('Rocksmith File Manager initialized successfully');
}

// Initialize app when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
