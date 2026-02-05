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
      lastModified: file.lastModified?.toISOString() || file.dateAdded.toISOString()
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
      lastModified: new Date(file.lastModified)
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
