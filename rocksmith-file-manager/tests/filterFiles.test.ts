import { addFile, clearAllFiles, filterFiles, setFiles } from '../src/scripts/dataService';
import { RocksmithFile } from '../src/types/index';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock
});

describe('filterFiles', () => {
  beforeEach(() => {
    clearAllFiles();
    localStorage.clear();
  });

  it('should return all files when no filters are applied', () => {
    addFile('file1.psarc');
    addFile('file2.psarc');
    addFile('file3.psarc');
    
    const result = filterFiles('', 'all');
    expect(result).toHaveLength(3);
  });

  it('should filter files by search term (case-insensitive)', () => {
    addFile('song-artist.psarc');
    addFile('another-song.psarc');
    addFile('artist-special.psarc');
    
    const result = filterFiles('ARTIST', 'all');
    expect(result).toHaveLength(2);
    expect(result.map(f => f.fileName)).toEqual(['song-artist.psarc', 'artist-special.psarc']);
  });

  it('should filter files by exact search term', () => {
    addFile('file1.psarc');
    addFile('file2.psarc');
    addFile('test.psarc');
    
    const result = filterFiles('test', 'all');
    expect(result).toHaveLength(1);
    expect(result[0].fileName).toBe('test.psarc');
  });

  it('should return empty array when search term matches nothing', () => {
    addFile('file1.psarc');
    addFile('file2.psarc');
    
    const result = filterFiles('nonexistent', 'all');
    expect(result).toHaveLength(0);
  });

  it('should filter files by status', () => {
    const file1 = addFile('file1.psarc')!;
    const file2 = addFile('file2.psarc')!;
    const file3 = addFile('file3.psarc')!;
    
    // Manually update files to have different statuses
    const files: RocksmithFile[] = [
      { ...file1, status: 'good' },
      { ...file2, status: 'bad' },
      { ...file3, status: 'good' }
    ];
    setFiles(files);
    
    const result = filterFiles('', 'good');
    expect(result).toHaveLength(2);
    expect(result.every(f => f.status === 'good')).toBe(true);
  });

  it('should combine search term and status filter', () => {
    const file1 = addFile('song-artist.psarc')!;
    const file2 = addFile('another-song.psarc')!;
    const file3 = addFile('song-special.psarc')!;
    
    const files: RocksmithFile[] = [
      { ...file1, status: 'good' },
      { ...file2, status: 'bad' },
      { ...file3, status: 'good' }
    ];
    setFiles(files);
    
    const result = filterFiles('song', 'good');
    expect(result).toHaveLength(2);
    expect(result.map(f => f.fileName)).toEqual(['song-artist.psarc', 'song-special.psarc']);
  });

  it('should handle whitespace in search term', () => {
    addFile('file1.psarc');
    addFile('file2.psarc');
    
    const result = filterFiles('  ', 'all');
    expect(result).toHaveLength(2);
  });

  it('should filter by wrongFormat status', () => {
    const file1 = addFile('file1.psarc')!;
    const file2 = addFile('file2.psarc')!;
    
    const files: RocksmithFile[] = [
      { ...file1, status: 'wrongFormat' },
      { ...file2, status: 'good' }
    ];
    setFiles(files);
    
    const result = filterFiles('', 'wrongFormat');
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('wrongFormat');
  });

  it('should filter by untested status', () => {
    addFile('file1.psarc');
    addFile('file2.psarc');
    
    const result = filterFiles('', 'untested');
    expect(result).toHaveLength(2);
    expect(result.every(f => f.status === 'untested')).toBe(true);
  });

  it('should return copy of files array, not reference', () => {
    addFile('file1.psarc');
    
    const result1 = filterFiles('', 'all');
    const result2 = filterFiles('', 'all');
    
    expect(result1).not.toBe(result2);
    expect(result1).toEqual(result2);
  });

  it('should handle partial matches in search', () => {
    addFile('test-file.psarc');
    addFile('testing.psarc');
    addFile('file-test.psarc');
    addFile('other.psarc');
    
    const result = filterFiles('test', 'all');
    expect(result).toHaveLength(3);
  });

  it('should be performant with large datasets', () => {
    // Add 500 files
    for (let i = 0; i < 500; i++) {
      addFile(`file${i}.psarc`);
    }
    
    const startTime = performance.now();
    const result = filterFiles('file1', 'all');
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(100); // Should complete in <100ms
    expect(result.length).toBeGreaterThan(0);
  });
});
