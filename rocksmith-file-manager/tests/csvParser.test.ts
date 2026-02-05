import { parseCSV, validateCSV } from '../src/scripts/csvParser';

describe('parseCSV', () => {
  it('should parse newline-delimited string', () => {
    const result = parseCSV('file1.psarc\nfile2.psarc\nfile3.psarc');
    expect(result).toEqual(['file1.psarc', 'file2.psarc', 'file3.psarc']);
  });
  
  it('should parse comma-delimited string', () => {
    const result = parseCSV('file1.psarc, file2.psarc, file3.psarc');
    expect(result).toEqual(['file1.psarc', 'file2.psarc', 'file3.psarc']);
  });
  
  it('should handle no spaces in comma format', () => {
    const result = parseCSV('file1.psarc,file2.psarc,file3.psarc');
    expect(result).toEqual(['file1.psarc', 'file2.psarc', 'file3.psarc']);
  });
  
  it('should handle single file import', () => {
    const result = parseCSV('singlefile.psarc');
    expect(result).toEqual(['singlefile.psarc']);
  });
  
  it('should filter empty entries in comma format', () => {
    const result = parseCSV('file1.psarc, , file2.psarc');
    expect(result).toEqual(['file1.psarc', 'file2.psarc']);
  });
  
  it('should filter empty lines in newline format', () => {
    const result = parseCSV('file1.psarc\n\nfile2.psarc\n\n\nfile3.psarc');
    expect(result).toEqual(['file1.psarc', 'file2.psarc', 'file3.psarc']);
  });
  
  it('should return empty array for empty string', () => {
    const result = parseCSV('');
    expect(result).toEqual([]);
  });
  
  it('should return empty array for whitespace only', () => {
    const result = parseCSV('   \n  \n   ');
    expect(result).toEqual([]);
  });
  
  it('should handle trailing commas', () => {
    const result = parseCSV('file1.psarc, file2.psarc,');
    expect(result).toEqual(['file1.psarc', 'file2.psarc']);
  });
  
  it('should handle leading commas', () => {
    const result = parseCSV(', file1.psarc, file2.psarc');
    expect(result).toEqual(['file1.psarc', 'file2.psarc']);
  });
  
  it('should handle multiple consecutive commas', () => {
    const result = parseCSV('file1.psarc,,,file2.psarc');
    expect(result).toEqual(['file1.psarc', 'file2.psarc']);
  });
  
  it('should trim whitespace from file names', () => {
    const result = parseCSV('  file1.psarc  ,  file2.psarc  ');
    expect(result).toEqual(['file1.psarc', 'file2.psarc']);
  });
  
  it('should handle Windows-style line endings (CRLF)', () => {
    const result = parseCSV('file1.psarc\r\nfile2.psarc\r\nfile3.psarc');
    expect(result).toEqual(['file1.psarc', 'file2.psarc', 'file3.psarc']);
  });
  
  it('should handle mixed newlines and whitespace', () => {
    const result = parseCSV('file1.psarc\n  \n  file2.psarc  \n\nfile3.psarc  ');
    expect(result).toEqual(['file1.psarc', 'file2.psarc', 'file3.psarc']);
  });
  
  it('should handle large number of files', () => {
    const fileList = Array.from({ length: 1000 }, (_, i) => `file${i}.psarc`).join('\n');
    const result = parseCSV(fileList);
    expect(result).toHaveLength(1000);
    expect(result[0]).toBe('file0.psarc');
    expect(result[999]).toBe('file999.psarc');
  });
});

describe('validateCSV', () => {
  it('should validate non-empty input', () => {
    const result = validateCSV('file1.psarc\nfile2.psarc');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.fileCount).toBe(2);
  });
  
  it('should reject empty input', () => {
    const result = validateCSV('');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Input is empty');
    expect(result.fileCount).toBe(0);
  });
  
  it('should reject whitespace-only input', () => {
    const result = validateCSV('   \n  ');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Input is empty');
  });
  
  it('should detect duplicates in input', () => {
    const result = validateCSV('file1.psarc\nfile2.psarc\nfile1.psarc');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('Duplicate');
  });
  
  it('should reject input with only empty lines', () => {
    const result = validateCSV('\n\n\n');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Input is empty');
  });
  
  it('should return correct file count', () => {
    const result = validateCSV('file1.psarc, file2.psarc, file3.psarc');
    expect(result.fileCount).toBe(3);
  });
  
  it('should validate single file', () => {
    const result = validateCSV('singlefile.psarc');
    expect(result.valid).toBe(true);
    expect(result.fileCount).toBe(1);
  });
});
