import { RocksmithFile, FileStatus } from '../types/index';
import { saveData } from './storageService';

// In-memory data store
let files: RocksmithFile[] = [];

/**
 * Generates a unique identifier
 * @returns A unique ID string
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
  // Check for duplicate
  const duplicate = files.find(f => f.fileName === fileName);
  if (duplicate) {
    return null;
  }

  const newFile: RocksmithFile = {
    id: generateId(),
    fileName: fileName,
    status: 'untested',
    dateAdded: new Date(),
    lastModified: new Date()
  };

  files.push(newFile);
  saveData(files);  // Auto-save
  return newFile;
}

/**
 * Retrieves all files from the data store
 * @returns Array of all files (copy, not reference)
 */
export function getFiles(): RocksmithFile[] {
  return [...files];
}

/**
 * Retrieves a file by its ID
 * @param id - The file ID
 * @returns The file or undefined if not found
 */
export function getFileById(id: string): RocksmithFile | undefined {
  return files.find(f => f.id === id);
}

/**
 * Updates the status of a file
 * @param id - The file ID
 * @param status - The new status
 * @returns True if successful, false if file not found
 */
export function updateFileStatus(id: string, status: FileStatus): boolean {
  const file = files.find(f => f.id === id);
  if (!file) {
    return false;
  }

  file.status = status;
  saveData(files);  // Auto-save
  file.lastModified = new Date();
  return true;
}

/**
 * Deletes a file from the data store
 * @param id - The file ID
 * @returns True if successful, false if file not found
 */
export function deleteFile(id: string): boolean {
  const index = files.findIndex(f => f.id === id);
  if (index === -1) {
    return false;
  }

  files.splice(index, 1);
  saveData(files);  // Auto-save
  return true;
}

/**
 * Clears all files from the data store
 */
export function clearAllFiles(): void {
  files = [];
  saveData(files);  // Auto-save
}

/**
 * Sets the files array (used for initialization from storage)
 * @param newFiles - Array of files to set
 */
export function setFiles(newFiles: RocksmithFile[]): void {
  files = [...newFiles];
}

