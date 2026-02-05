import { saveData, loadData, clearData } from '../src/scripts/storageService';
import type { RocksmithFile } from '../src/types/index';

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

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveData', () => {
    it('should save files to localStorage', () => {
      const files: RocksmithFile[] = [{
        id: '123',
        fileName: 'test.psarc',
        status: 'untested',
        dateAdded: new Date('2026-01-01'),
        lastModified: new Date('2026-01-01')
      }];

      const result = saveData(files);
      expect(result).toBe(true);
      expect(localStorage.getItem('rocksmith-file-manager-data')).toBeTruthy();
    });

    it('should serialize Dates to ISO strings', () => {
      const files: RocksmithFile[] = [{
        id: '123',
        fileName: 'test.psarc',
        status: 'untested',
        dateAdded: new Date('2026-01-01T00:00:00.000Z'),
        lastModified: new Date('2026-01-01T00:00:00.000Z')
      }];

      saveData(files);
      const saved = localStorage.getItem('rocksmith-file-manager-data');
      expect(saved).toContain('2026-01-01T00:00:00.000Z');
    });

    it('should save multiple files', () => {
      const files: RocksmithFile[] = [
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

      const result = saveData(files);
      expect(result).toBe(true);
      
      const saved = JSON.parse(localStorage.getItem('rocksmith-file-manager-data')!);
      expect(saved).toHaveLength(2);
    });

    it('should save empty array', () => {
      const result = saveData([]);
      expect(result).toBe(true);
      
      const saved = localStorage.getItem('rocksmith-file-manager-data');
      expect(saved).toBe('[]');
    });

    it('should handle quota exceeded error', () => {
      // Mock setItem to throw QuotaExceededError
      const originalSetItem = localStorage.setItem;
      const error = new Error('QuotaExceededError');
      error.name = 'QuotaExceededError';
      
      localStorage.setItem = jest.fn(() => {
        throw error;
      });
      
      // Mock alert
      global.alert = jest.fn();
      
      const result = saveData([{
        id: '1',
        fileName: 'test.psarc',
        status: 'untested',
        dateAdded: new Date(),
        lastModified: new Date()
      }]);
      
      expect(result).toBe(false);
      expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('quota exceeded'));
      
      // Restore
      localStorage.setItem = originalSetItem;
    });

    it('should handle generic save errors', () => {
      // Mock setItem to throw generic error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('Generic error');
      });
      
      const result = saveData([{
        id: '1',
        fileName: 'test.psarc',
        status: 'untested',
        dateAdded: new Date(),
        lastModified: new Date()
      }]);
      
      expect(result).toBe(false);
      
      // Restore
      localStorage.setItem = originalSetItem;
    });
  });

  describe('loadData', () => {
    it('should load files from localStorage', () => {
      const files: RocksmithFile[] = [{
        id: '123',
        fileName: 'test.psarc',
        status: 'good',
        dateAdded: new Date('2026-01-01'),
        lastModified: new Date('2026-01-01')
      }];

      saveData(files);
      const loaded = loadData();
      
      expect(loaded).toHaveLength(1);
      expect(loaded[0].fileName).toBe('test.psarc');
      expect(loaded[0].status).toBe('good');
    });

    it('should deserialize ISO strings to Dates', () => {
      const files: RocksmithFile[] = [{
        id: '123',
        fileName: 'test.psarc',
        status: 'untested',
        dateAdded: new Date('2026-01-01'),
        lastModified: new Date('2026-01-01')
      }];

      saveData(files);
      const loaded = loadData();
      
      expect(loaded[0].dateAdded).toBeInstanceOf(Date);
      expect(loaded[0].lastModified).toBeInstanceOf(Date);
    });

    it('should return empty array for no data', () => {
      const loaded = loadData();
      expect(loaded).toEqual([]);
    });

    it('should handle corrupted data gracefully', () => {
      localStorage.setItem('rocksmith-file-manager-data', 'invalid json');
      const loaded = loadData();
      expect(loaded).toEqual([]);
    });

    it('should preserve all file properties', () => {
      const files: RocksmithFile[] = [{
        id: 'abc123',
        fileName: 'song.psarc',
        status: 'wrongFormat',
        dateAdded: new Date('2026-01-15T10:30:00.000Z'),
        lastModified: new Date('2026-01-20T15:45:00.000Z')
      }];

      saveData(files);
      const loaded = loadData();
      
      expect(loaded[0].id).toBe('abc123');
      expect(loaded[0].fileName).toBe('song.psarc');
      expect(loaded[0].status).toBe('wrongFormat');
      expect(loaded[0].dateAdded.toISOString()).toBe('2026-01-15T10:30:00.000Z');
      expect(loaded[0].lastModified!.toISOString()).toBe('2026-01-20T15:45:00.000Z');
    });

    it('should load multiple files in correct order', () => {
      const files: RocksmithFile[] = [
        {
          id: '1',
          fileName: 'first.psarc',
          status: 'good',
          dateAdded: new Date(),
          lastModified: new Date()
        },
        {
          id: '2',
          fileName: 'second.psarc',
          status: 'bad',
          dateAdded: new Date(),
          lastModified: new Date()
        }
      ];

      saveData(files);
      const loaded = loadData();
      
      expect(loaded).toHaveLength(2);
      expect(loaded[0].fileName).toBe('first.psarc');
      expect(loaded[1].fileName).toBe('second.psarc');
    });
  });

  describe('clearData', () => {
    it('should remove data from localStorage', () => {
      const files: RocksmithFile[] = [{
        id: '123',
        fileName: 'test.psarc',
        status: 'untested',
        dateAdded: new Date(),
        lastModified: new Date()
      }];

      saveData(files);
      expect(localStorage.getItem('rocksmith-file-manager-data')).toBeTruthy();
      
      clearData();
      expect(localStorage.getItem('rocksmith-file-manager-data')).toBeNull();
    });

    it('should work when no data exists', () => {
      clearData();
      expect(localStorage.getItem('rocksmith-file-manager-data')).toBeNull();
    });
  });

  describe('save and load integration', () => {
    it('should round-trip data correctly', () => {
      const originalFiles: RocksmithFile[] = [
        {
          id: 'id1',
          fileName: 'file1.psarc',
          status: 'good',
          dateAdded: new Date('2026-01-01T00:00:00.000Z'),
          lastModified: new Date('2026-01-01T12:00:00.000Z')
        },
        {
          id: 'id2',
          fileName: 'file2.psarc',
          status: 'bad',
          dateAdded: new Date('2026-01-02T00:00:00.000Z'),
          lastModified: new Date('2026-01-02T12:00:00.000Z')
        },
        {
          id: 'id3',
          fileName: 'file3.psarc',
          status: 'wrongFormat',
          dateAdded: new Date('2026-01-03T00:00:00.000Z'),
          lastModified: new Date('2026-01-03T12:00:00.000Z')
        }
      ];

      saveData(originalFiles);
      const loadedFiles = loadData();

      expect(loadedFiles).toHaveLength(3);
      
      loadedFiles.forEach((loaded, index) => {
        const original = originalFiles[index];
        expect(loaded.id).toBe(original.id);
        expect(loaded.fileName).toBe(original.fileName);
        expect(loaded.status).toBe(original.status);
        expect(loaded.dateAdded.getTime()).toBe(original.dateAdded.getTime());
        expect(loaded.lastModified!.getTime()).toBe(original.lastModified!.getTime());
      });
    });
  });
});
