# Rocksmith File Manager - Project Ideation

## Project Overview
A web-based application to manage and track the status of Rocksmith custom song files. The application will allow users to categorize imported files based on their quality and usability, with visual indicators for quick status identification.

## Core Features

### 1. File Management
- **Manual Entry**: Allow users to type individual file names into the system
- **Bulk Import**: Support importing comma-delimited lists of file names
- **File List Display**: Maintain a persistent list of all imported files with their current status

### 2. Status Categories
The application needs to support four distinct status categories:
- **Good**: Files that work correctly with proper guitar tablature
- **Bad**: Files with incorrect or rolling tablature
- **Wrong Format**: Bass-only files without guitar tracks
- **Untested**: Files that haven't been evaluated yet

### 3. Visual Status Indicators
Each file entry should display a colored icon representing its status:
- **Good**: Green circle ●
- **Bad**: Red circle ●
- **Wrong Format**: Red circle with line through it ⊘
- **Untested**: Yellow circle ●

### 4. Status Management
- Users should be able to manually update the status of any file
- Default status for new entries should be "Untested"
- Status changes should be intuitive (dropdown, button clicks, or similar UI pattern)

## Technical Requirements

### Technology Stack
- **Primary Language**: JavaScript and/or TypeScript
- **Frontend Framework**: To be determined (React, Vue, or vanilla JS)
- **Data Storage**: Local storage or lightweight database solution

### Key Functionalities to Implement

#### Data Model
```typescript
interface RocksmithFile {
  id: string | number;
  fileName: string;
  status: 'good' | 'bad' | 'wrongFormat' | 'untested';
  dateAdded: Date;
  lastModified?: Date;
}
```

#### User Interface Components
1. **Input Section**
   - Text input for single file name entry
   - Text area for comma-delimited bulk import
   - Submit/Add button

2. **File List Display**
   - Sortable/filterable list of files
   - Visual status indicator for each entry
   - Status update controls (dropdown or buttons)
   - Optional: Delete/Remove functionality

3. **Filter/Search Capabilities** (Optional Enhancement)
   - Filter by status category
   - Search by file name
   - Status count summary

#### Core Functions to Develop
- `addFile(fileName: string)`: Add single file to the list
- `importFiles(csvString: string)`: Parse and import comma-delimited files
- `updateStatus(fileId, newStatus)`: Update file status
- `getFiles(filterBy?)`: Retrieve file list with optional filtering
- `deleteFile(fileId)`: Remove file from list
- `saveData()`: Persist data to storage
- `loadData()`: Load data from storage on app initialization

## User Workflow

1. **Initial Setup**: User opens the application
2. **File Addition**: User adds file names either individually or via CSV import
3. **Testing Process**: User tests files in Rocksmith externally
4. **Status Update**: User returns to app and updates file status based on testing results
5. **Ongoing Management**: User continues testing and updating as needed

## Development Phases

### Phase 1: Core Functionality
- Set up project structure (HTML, CSS, JS/TS)
- Implement data model
- Create basic UI for file entry
- Implement add file functionality
- Display file list with status indicators

### Phase 2: Status Management
- Implement status update controls
- Add visual status icons with proper styling
- Ensure status changes persist

### Phase 3: Bulk Import
- Parse comma-delimited input
- Validate and import multiple files
- Handle duplicate entries

### Phase 4: Data Persistence
- Implement local storage or database integration
- Save state on changes
- Load saved data on app initialization

### Phase 5: Polish & Enhancements
- Improve UI/UX design
- Add filtering and search capabilities
- Implement delete/edit functionality
- Add keyboard shortcuts for efficiency
- Responsive design considerations

## Success Criteria
- Users can easily add files individually or in bulk
- Status indicators are clearly visible and distinguishable
- Status updates are intuitive and quick
- Data persists between sessions
- Application is responsive and performant with large file lists

## Future Enhancements (Optional)
- Export filtered lists
- Statistics dashboard (counts per status)
- Notes field for additional comments per file
- Import/export entire database for backup
- Multi-user support or cloud sync
- Integration with Rocksmith file directories
