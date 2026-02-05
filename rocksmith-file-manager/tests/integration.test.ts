import { 
  addFile, 
  getFiles, 
  updateFileStatus, 
  deleteFile, 
  clearAllFiles,
  setFiles 
} from '../src/scripts/dataService';
import { loadData } from '../src/scripts/storageService';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

global.localStorage = localStorageMock as Storage;

describe('Data Persistence Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    clearAllFiles();
  });

  it('should persist added files', () => {
    // Add files
    addFile('song1.psarc');
    addFile('song2.psarc');
    addFile('song3.psarc');

    // Simulate page reload by loading data
    const savedFiles = loadData();
    expect(savedFiles).toHaveLength(3);
    
    // Restore to data service
    clearAllFiles();
    setFiles(savedFiles);
    
    const files = getFiles();
    expect(files).toHaveLength(3);
    expect(files.map(f => f.fileName)).toEqual(['song1.psarc', 'song2.psarc', 'song3.psarc']);
  });

  it('should persist status updates', () => {
    // Add and update files
    const file = addFile('test.psarc');
    updateFileStatus(file!.id, 'good');

    // Simulate page reload
    const savedFiles = loadData();
    expect(savedFiles[0].status).toBe('good');
  });

  it('should persist deletions', () => {
    // Add files
    const file1 = addFile('file1.psarc');
    const file2 = addFile('file2.psarc');
    addFile('file3.psarc');

    // Delete one
    deleteFile(file2!.id);

    // Simulate page reload
    const savedFiles = loadData();
    expect(savedFiles).toHaveLength(2);
    expect(savedFiles.find(f => f.id === file1!.id)).toBeTruthy();
    expect(savedFiles.find(f => f.id === file2!.id)).toBeUndefined();
  });

  it('should handle complete user workflow', () => {
    // Day 1: Add files
    addFile('song1.psarc');
    addFile('song2.psarc');

    // Simulate page reload
    let savedFiles = loadData();
    clearAllFiles();
    setFiles(savedFiles);

    // Day 2: Add more files and update status
    const file3 = addFile('song3.psarc');
    const files = getFiles();
    updateFileStatus(files[0].id, 'good');
    updateFileStatus(files[1].id, 'bad');

    // Simulate another page reload
    savedFiles = loadData();
    clearAllFiles();
    setFiles(savedFiles);

    // Day 3: Delete a file
    deleteFile(file3!.id);

    // Final state check
    savedFiles = loadData();
    expect(savedFiles).toHaveLength(2);
    expect(savedFiles[0].status).toBe('good');
    expect(savedFiles[1].status).toBe('bad');
  });

  it('should maintain data integrity with timestamps', () => {
    const file = addFile('test.psarc');
    const originalAddedTime = file!.dateAdded.getTime();

    // Update status
    updateFileStatus(file!.id, 'good');
    
    // Reload data
    const savedFiles = loadData();
    clearAllFiles();
    setFiles(savedFiles);
    
    const reloadedFile = getFiles()[0];
    
    // dateAdded should be preserved
    expect(reloadedFile.dateAdded.getTime()).toBe(originalAddedTime);
    
    // lastModified should exist and be a Date
    expect(reloadedFile.lastModified).toBeInstanceOf(Date);
  });

  it('should handle empty state after clearing all', () => {
    // Add files
    addFile('file1.psarc');
    addFile('file2.psarc');

    // Clear all
    clearAllFiles();

    // Reload
    const savedFiles = loadData();
    expect(savedFiles).toHaveLength(0);
  });
});
