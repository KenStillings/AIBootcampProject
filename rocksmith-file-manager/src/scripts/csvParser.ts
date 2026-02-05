/**
 * Parses a string of file names (supports newline or comma-delimited formats)
 * @param input - The input string to parse
 * @returns Array of file names (trimmed, no empties)
 */
export function parseCSV(input: string): string[] {
  if (!input || input.trim() === '') {
    return [];
  }
  
  // Try splitting by newlines first (handles line-delimited format)
  let fileNames = input
    .split(/\r?\n/)
    .map(name => name.trim())
    .filter(name => name.length > 0);
  
  // If only one line, try comma-delimited format
  if (fileNames.length === 1 && fileNames[0].includes(',')) {
    fileNames = fileNames[0]
      .split(',')
      .map(name => name.trim())
      .filter(name => name.length > 0);
  }
  
  return fileNames;
}

/**
 * Validates CSV input format
 * @param input - The input string to validate
 * @returns Validation result with errors if any
 */
export function validateCSV(input: string): {
  valid: boolean;
  errors: string[];
  fileCount: number;
} {
  const errors: string[] = [];
  
  if (!input || input.trim() === '') {
    errors.push('Input is empty');
    return { valid: false, errors, fileCount: 0 };
  }
  
  const fileNames = parseCSV(input);
  
  if (fileNames.length === 0) {
    errors.push('No valid file names found');
  }
  
  // Check for duplicates in the input
  const duplicates = fileNames.filter((name, index) => fileNames.indexOf(name) !== index);
  if (duplicates.length > 0) {
    errors.push(`Duplicate entries found: ${duplicates.join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    fileCount: fileNames.length
  };
}
