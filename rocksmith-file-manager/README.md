# Rocksmith File Manager

A web-based application to manage and track the status of your Rocksmith custom song files (CDLC). Keep track of which files work correctly, which have issues, and organize your growing library with ease.

## ✨ Features

- **📁 Individual File Addition**: Add files one at a time with auto-save
- **📋 Bulk CSV Import**: Import multiple files at once using comma-delimited or newline-delimited format
- **🎨 Visual Status Indicators**: Color-coded icons for instant file status recognition
- **🔍 Live Search**: Find files quickly with instant case-insensitive search
- **🎯 Status Filtering**: Filter by Good, Bad, Wrong Format, or Untested status
- **💾 Data Persistence**: All changes saved automatically to browser localStorage
- **⌨️ Keyboard Shortcuts**: 
  - `Ctrl/Cmd + Enter` to import files
  - `/` to focus search
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **⚡ High Performance**: Search through 500+ files in under 100ms
- **🧪 Thoroughly Tested**: 98.97% test coverage with 76 passing tests

## 📸 Screenshots

### Main Interface
The clean, intuitive interface displays all your files with visual status indicators:
- 🟢 **Green**: Good files with proper tablature
- 🔴 **Red**: Bad files with incorrect tablature
- ⊘ **Red with line**: Wrong format (bass-only files)
- 🟡 **Yellow**: Untested files

## 🚀 Quick Start

### Installation

No installation required! This application runs entirely in your web browser.

1. **Download or clone this repository**
   ```bash
   git clone https://github.com/yourusername/rocksmith-file-manager.git
   cd rocksmith-file-manager
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use the development server (see Development section below)

3. **Start tracking your files!**

### Prerequisites

- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+)
- JavaScript enabled
- No server or backend required

## 📖 Usage Guide

### Adding Files

**Single File:**
1. Type the file name (e.g., `song-name.psarc`) in the input field
2. Press `Enter` or click **Add File**
3. File appears in the list with "Untested" status

**Bulk Import:**
1. Click the **Bulk Import** section to expand
2. Paste your file list in one of these formats:
   - **Comma-delimited**: `song1.psarc, song2.psarc, song3.psarc`
   - **Newline-delimited**: One file per line
   - **Single file**: Just paste a single filename
3. Press `Ctrl/Cmd + Enter` or click **Import Files**
4. See import summary showing successful imports and duplicates

### Managing File Status

1. Locate the file in your list
2. Click the status dropdown next to the file name
3. Select the new status:
   - **Good**: File works correctly with proper tablature
   - **Bad**: File has incorrect or rolling tablature
   - **Wrong Format**: Bass-only file without guitar tracks
   - **Untested**: Not yet tested (default for new files)
4. Status updates instantly and saves automatically

### Deleting Files

1. Click the **Delete** button (🗑️) next to the file
2. Confirm deletion in the popup dialog
3. File is permanently removed

### Searching and Filtering

**Search:**
- Type in the search box to find files by name (case-insensitive)
- Press `/` keyboard shortcut to jump to search
- Results update instantly as you type

**Filter by Status:**
- Click any status button (All, Good, Bad, Wrong Format, Untested)
- View only files matching that status
- Combine search and filter for precise results
- See filtered count: "Showing X of Y files"

**Clear Filters:**
- Click **All** button to show all files
- Clear the search box to remove search filter

## 🛠️ Technology Stack

- **TypeScript 5.9.3**: Type-safe development with strict mode
- **HTML5/CSS3**: Modern web standards
- **Jest 29.7.0**: Comprehensive testing framework
- **LocalStorage API**: Client-side data persistence
- **No external dependencies**: Pure web technologies

## 💻 Development

### Setup Development Environment

```bash
# Install dependencies
npm install

# Run TypeScript compiler in watch mode
npm run dev

# Or build once
npm run build

# Start development server
npm run serve
# Then open http://localhost:8080
```

### Project Structure

```
rocksmith-file-manager/
├── src/
│   ├── scripts/          # TypeScript source files
│   │   ├── main.ts       # Application entry point
│   │   ├── dataService.ts    # CRUD operations
│   │   ├── storageService.ts # localStorage integration
│   │   ├── csvParser.ts      # CSV parsing logic
│   │   ├── ui.ts             # UI event handlers
│   │   └── renderer.ts       # DOM rendering
│   ├── styles/
│   │   └── main.css      # Application styles
│   └── types/
│       └── index.ts      # TypeScript type definitions
├── tests/                # Test files
│   ├── dataService.test.ts
│   ├── storageService.test.ts
│   ├── csvParser.test.ts
│   ├── filterFiles.test.ts
│   └── integration.test.ts
├── dist/                 # Compiled JavaScript (generated)
├── coverage/             # Test coverage reports (generated)
├── index.html            # Application entry point
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── jest.config.js        # Jest test configuration
```

### Available Scripts

```bash
# Development
npm run dev              # Watch mode - recompile on changes
npm run build            # Build TypeScript to JavaScript
npm run serve            # Start local development server
npm start                # Build and serve

# Testing
npm test                 # Run all tests
npm run test:coverage    # Run tests with coverage report
npm run test:watch       # Run tests in watch mode

# Utilities
npm run clean            # Remove dist/ and coverage/ directories
```

## 🧪 Testing

This project maintains **98.97% test coverage** across all core modules.

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Watch mode for development
npm run test:watch

# Run specific test file
npm test csvParser.test.ts
```

### Test Coverage

Current coverage (as of Sprint 4):
- **Statements**: 98.97%
- **Branches**: 83.33%
- **Functions**: 100%
- **Lines**: 98.87%

Coverage exceeds the 80% threshold for all metrics.

### View Coverage Report

After running `npm run test:coverage`, open `coverage/index.html` in your browser to see detailed line-by-line coverage.

## 🌐 Browser Support

Tested and verified on:
- ✅ **Chrome** (latest)
- ✅ **Firefox** (latest)
- ✅ **Safari** (latest)
- ✅ **Edge** (latest)

Requires:
- ES2020 support
- LocalStorage API
- DOM manipulation capabilities

## 📱 Mobile Support

Fully responsive design tested on:
- 📱 Mobile (375px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1920px+)

Touch-friendly interface with adequate touch targets for mobile devices.

## ⚙️ Configuration

The application uses browser localStorage with the key `rocksmith-file-manager-data`.

### Storage Limits

- **Maximum files**: ~10,000 files (depends on filename length)
- **Storage quota**: 5-10MB (browser-dependent)
- **Data format**: JSON serialization with ISO date strings

### Error Handling

- Quota exceeded: Displays error message
- Corrupted data: Gracefully resets to empty state
- Parse errors: Caught and logged to console

## 🔒 Privacy & Data

- **All data stays local**: Nothing is sent to any server
- **No tracking**: No analytics or telemetry
- **No cookies**: Uses only localStorage
- **No account required**: Works offline after initial load

## 📋 Known Limitations

- Maximum ~10,000 files due to localStorage size constraints
- No cloud sync between devices
- No export functionality (planned for v1.1)
- No multi-user support (single-user application)
- No undo/redo functionality

## 🗺️ Roadmap

Planned features for future releases:

### v1.1
- Export to CSV functionality
- Bulk status updates
- Sort by date, name, or status
- Dark mode

### v1.2
- Cloud sync option
- Import/export backup files
- Advanced filtering (date ranges, partial matches)
- Statistics dashboard

### v2.0
- Desktop application (Electron)
- File metadata extraction
- Duplicate detection
- Custom status categories

## 🤝 Contributing

Contributions welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run tests**: `npm test` (ensure 80%+ coverage)
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Contribution Guidelines

- Follow TypeScript strict mode conventions
- Maintain test coverage ≥80%
- Add tests for new features
- Update documentation as needed
- Follow existing code style
- Keep commits atomic and well-described

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created by [Your Name]

Built for Rocksmith players who need to track and manage their growing CDLC libraries.

## 🙏 Acknowledgments

- Built for the Rocksmith custom content community
- Inspired by the need for simple, effective file management
- Thanks to all contributors and testers

## 💡 Tips & Tricks

- **Use bulk import**: Copy file lists from your file manager and paste directly
- **Keyboard shortcuts**: Learn the shortcuts for faster workflow
- **Regular backups**: Export your data occasionally (when feature is added)
- **Mobile use**: Access from your phone while testing songs on your computer
- **Filter combinations**: Use search + status filter together for precise results

## 🐛 Troubleshooting

### Data not persisting?
- Check if localStorage is enabled in your browser
- Check if you're in private/incognito mode (localStorage may be disabled)
- Try clearing browser cache and reloading

### Import not working?
- Ensure files are comma or newline delimited
- Check for special characters in filenames
- Try importing smaller batches (100 files at a time)

### Application slow?
- Large lists (1000+ files) may take time to render
- Try filtering to reduce visible items
- Consider archiving old files

## 📧 Support

For issues, questions, or suggestions:
- **Open an issue** on GitHub
- **Check existing issues** for similar problems
- **Provide details**: Browser version, steps to reproduce, screenshots

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: ✅ Production Ready  

Made with ❤️ for the Rocksmith community
