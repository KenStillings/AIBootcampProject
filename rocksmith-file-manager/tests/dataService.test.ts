import { 
  addFile, 
  getFiles, 
  getFileById, 
  updateFileStatus, 
  deleteFile, 
  clearAllFiles,
  setFiles 
} from '../src/scripts/dataService';
import type { RocksmithFile } from '../src/types/index';

// Mock storageService to avoid localStorage dependency
jest.mock('../src/scripts/storageService', () => ({
  saveData: jest.fn(() => true),
  loadData: jest.fn(() => []),
  clearData: jest.fn()
}));

describe('dataService', () => {
  beforeEach(() => {
    clearAllFiles();
  });

  describe('addFile', () => {
    it('should add a new file with default status', () => {
      const file = addFile('test.psarc');
      
      expect(file).not.toBeNull();
      expect(file?.fileName).toBe('test.psarc');
      expect(file?.status).toBe('untested');
      expect(file?.id).toBeTruthy();
      expect(file?.dateAdded).toBeInstanceOf(Date);
      expect(file?.lastModified).toBeInstanceOf(Date);
    });

    it('should reject duplicate file names', () => {
      addFile('test.psarc');
      const duplicate = addFile('test.psarc');
      
      expect(duplicate).toBeNull();
    });

    it('should add multiple unique files', () => {
      addFile('file1.psarc');
      addFile('file2.psarc');
      addFile('file3.psarc');
      
      const files = getFiles();
      expect(files).toHaveLength(3);
    });

    it('should generate unique IDs for each file', () => {
      const file1 = addFile('file1.psarc');
      const file2 = addFile('file2.psarc');
      
      expect(file1?.id).not.toBe(file2?.id);
    });
  });

  describe('getFiles', () => {
    it('should return empty array when no files exist', () => {
      const files = getFiles();
      expect(files).toEqual([]);
    });

    it('should return all files', () => {
      addFile('file1.psarc');
      addFile('file2.psarc');
      
      const files = getFiles();
      expect(files).toHaveLength(2);
    });

    it('should return a copy, not a reference', () => {
      addFile('test.psarc');
      const files1 = getFiles();
      const files2 = getFiles();
      
      expect(files1).not.toBe(files2);
      expect(files1).toEqual(files2);
    });
  });

  describe('getFileById', () => {
    it('should return file by ID', () => {
      const added = addFile('test.psarc');
      const found = getFileById(added!.id);
      
      expect(found).toEqual(added);
    });

    it('should return undefined for non-existent ID', () => {
      const found = getFileById('non-existent-id');
      expect(found).toBeUndefined();
    });
  });

  describe('updateFileStatus', () => {
    it('should update file status', () => {
      const file = addFile('test.psarc');
      const success = updateFileStatus(file!.id, 'good');
      
      expect(success).toBe(true);
      const updated = getFileById(file!.id);
      expect(updated?.status).toBe('good');
    });

    it('should update lastModified timestamp', () => {
      const file = addFile('test.psarc');
      
      updateFileStatus(file!.id, 'bad');
      const updated = getFileById(file!.id);
      expect(updated!.lastModified).toBeInstanceOf(Date);
    });

    it('should return false for non-existent file', () => {
      const success = updateFileStatus('non-existent-id', 'good');
      expect(success).toBe(false);
    });

    it('should update to all status types', () => {
      const file = addFile('test.psarc');
      
      updateFileStatus(file!.id, 'good');
      expect(getFileById(file!.id)?.status).toBe('good');
      
      updateFileStatus(file!.id, 'bad');
      expect(getFileById(file!.id)?.status).toBe('bad');
      
      updateFileStatus(file!.id, 'wrongFormat');
      expect(getFileById(file!.id)?.status).toBe('wrongFormat');
      
      updateFileStatus(file!.id, 'untested');
      expect(getFileById(file!.id)?.status).toBe('untested');
    });
  });

  describe('deleteFile', () => {
    it('should delete existing file', () => {
      const file = addFile('test.psarc');
      const success = deleteFile(file!.id);
      
      expect(success).toBe(true);
      expect(getFiles()).toHaveLength(0);
    });

    it('should return false for non-existent file', () => {
      const success = deleteFile('non-existent-id');
      expect(success).toBe(false);
    });

    it('should maintain other files when deleting one', () => {
      const file1 = addFile('file1.psarc');
      const file2 = addFile('file2.psarc');
      const file3 = addFile('file3.psarc');
      
      deleteFile(file2!.id);
      
      const files = getFiles();
      expect(files).toHaveLength(2);
      expect(files.find(f => f.id === file1!.id)).toBeTruthy();
      expect(files.find(f => f.id === file3!.id)).toBeTruthy();
      expect(files.find(f => f.id === file2!.id)).toBeUndefined();
    });
  });

  describe('clearAllFiles', () => {
    it('should remove all files', () => {
      addFile('file1.psarc');
      addFile('file2.psarc');
      addFile('file3.psarc');
      
      clearAllFiles();
      
      expect(getFiles()).toHaveLength(0);
    });

    it('should work when no files exist', () => {
      clearAllFiles();
      expect(getFiles()).toHaveLength(0);
    });
  });

  describe('setFiles', () => {
    it('should set files array from external source', () => {
      const externalFiles: RocksmithFile[] = [
        {
          id: '1',
          fileName: 'file1.psarc',
          status: 'good',
          dateAdded: new Date(),
          lastModified: new Date()
        },
        {
          id: '2',
          fileName: 'file2.psarc',
          status: 'bad',
          dateAdded: new Date(),
          lastModified: new Date()
        }
      ];
      
      setFiles(externalFiles);
      
      const files = getFiles();
      expect(files).toHaveLength(2);
      expect(files[0].fileName).toBe('file1.psarc');
      expect(files[1].fileName).toBe('file2.psarc');
    });

    it('should create a copy of the input array', () => {
      const externalFiles: RocksmithFile[] = [{
        id: '1',
        fileName: 'test.psarc',
        status: 'untested',
        dateAdded: new Date(),
        lastModified: new Date()
      }];
      
      setFiles(externalFiles);
      externalFiles.push({
        id: '2',
        fileName: 'another.psarc',
        status: 'untested',
        dateAdded: new Date(),
        lastModified: new Date()
      });
      
      expect(getFiles()).toHaveLength(1);
    });

    it('should replace existing files', () => {
      addFile('existing.psarc');
      
      const newFiles: RocksmithFile[] = [{
        id: 'new1',
        fileName: 'new.psarc',
        status: 'good',
        dateAdded: new Date(),
        lastModified: new Date()
      }];
      
      setFiles(newFiles);
      
      const files = getFiles();
      expect(files).toHaveLength(1);
      expect(files[0].fileName).toBe('new.psarc');
    });
  });
});
