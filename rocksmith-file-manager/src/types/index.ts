/**
 * Represents the possible status values for a Rocksmith file
 */
export type FileStatus = 'good' | 'bad' | 'wrongFormat' | 'untested';

/**
 * Represents a Rocksmith custom song file entry
 */
export interface RocksmithFile {
  /** Unique identifier for the file */
  id: string;
  
  /** Name of the file (e.g., 'song-artist.psarc') */
  fileName: string;
  
  /** Current status of the file */
  status: FileStatus;
  
  /** Timestamp when the file was added */
  dateAdded: Date;
  
  /** Timestamp of the last status update */
  lastModified?: Date;
}
