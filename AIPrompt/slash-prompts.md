# Slash Prompts for AI Development Workflow

This document contains reusable slash-style prompts for streamlining the development workflow. These prompts are designed to be quick, interactive commands that trigger specific development actions.

---

## Project Initialization

### `/create-project`

**Description:** Generates complete project documentation from an initial idea.

**Parameters:**
- `idea-file` (optional): Path to the idea file (default: `GeneralIdea.txt`)
- `coverage` (optional): Test coverage percentage (default: `80`)

**Usage:**
```
/create-project
```

**Interactive Prompts:**
1. "Where is your idea file located?" (default: GeneralIdea.txt)
2. "What test coverage percentage do you want?" (default: 80%)
3. "How many sprints should the project have?" (default: 5)

**Actions Performed:**
1. Read the idea file
2. Generate `CreatedIdeation.md`
3. Generate `DevelopmentPlan.md` with test coverage requirements
4. Generate individual sprint plans (`Sprint1-TaskPlan.md` through `Sprint5-TaskPlan.md`)
5. Move all generated files to `GeneratedDocs/` folder
6. Display summary of created files

**Expected Output:**
```
✅ Created CreatedIdeation.md
✅ Created DevelopmentPlan.md (80% test coverage)
✅ Created Sprint1-TaskPlan.md
✅ Created Sprint2-TaskPlan.md
✅ Created Sprint3-TaskPlan.md
✅ Created Sprint4-TaskPlan.md
✅ Created Sprint5-TaskPlan.md
✅ Moved all files to GeneratedDocs/

Project documentation complete! Ready to start Sprint 1.
```

---

## Sprint Management

### `/perform-sprint`

**Description:** Executes all tasks in a specified sprint following established coding guidelines.

**Parameters:**
- `sprint-number` (required): Sprint number to execute (1-5)

**Usage:**
```
/perform-sprint
```

**Interactive Prompts:**
1. "Which sprint do you want to perform?" (options: 1, 2, 3, 4, 5)
2. "Confirm execution of Sprint [N] tasks?" (yes/no)

**Actions Performed:**
1. Verify prerequisites from previous sprints are complete
2. Read `GeneratedDocs/Sprint[N]-TaskPlan.md`
3. Load coding/testing/UI guidelines from `Docs/` directory
4. Execute each task in sequence:
   - Create required files
   - Implement functionality
   - Update configurations
   - Build and verify compilation
5. Run build verification (`npm run build`)
6. Display completion summary

**Expected Output:**
```
📋 Sprint 2: Core Functionality
Prerequisites verified ✅

Implementing tasks:
✅ Task 2.1: Data Service (src/scripts/dataService.ts)
✅ Task 2.2: File Addition UI (src/scripts/ui.ts)
✅ Task 2.3: File List Renderer (src/scripts/renderer.ts)
✅ Task 2.4: Status Indicators (CSS updated)

Build verification: ✅ Success

Sprint 2 complete! Ready for Sprint 3.
```

---

### `/next-sprint`

**Description:** Automatically determines and executes the next sprint in sequence.

**Usage:**
```
/next-sprint
```

**Interactive Prompts:**
1. "Ready to start Sprint [N]?" (yes/no)

**Actions Performed:**
1. Detect which sprint files exist in `src/` directory
2. Determine the next sprint to execute
3. Execute `/perform-sprint` with detected sprint number

**Expected Output:**
```
Detected completed sprints: 1, 2
Next sprint: 3

Executing Sprint 3: Data Management...
[Sprint execution output follows]
```

---

### `/review-sprint`

**Description:** Reviews what was completed in a specific sprint and validates against acceptance criteria.

**Parameters:**
- `sprint-number` (required): Sprint number to review (1-5)

**Usage:**
```
/review-sprint
```

**Interactive Prompts:**
1. "Which sprint do you want to review?" (options: 1, 2, 3, 4, 5)

**Actions Performed:**
1. Read `GeneratedDocs/Sprint[N]-TaskPlan.md`
2. Check for existence of files that should have been created
3. Verify build passes
4. List completed vs. pending tasks
5. Validate acceptance criteria

**Expected Output:**
```
📊 Sprint 2 Review: Core Functionality

Files Created:
✅ src/scripts/dataService.ts
✅ src/scripts/ui.ts
✅ src/scripts/renderer.ts
✅ src/scripts/main.ts

Build Status: ✅ Pass

Acceptance Criteria:
✅ Files can be added individually
✅ Input validation working
✅ Toast notifications functional
✅ File list renders with status indicators
✅ Empty state displays correctly

Status: COMPLETE ✅
```

---

## Testing & Quality

### `/run-tests`

**Description:** Executes test suite with coverage reporting.

**Parameters:**
- `watch` (optional): Run in watch mode (default: false)
- `coverage` (optional): Generate coverage report (default: true)

**Usage:**
```
/run-tests
```

**Interactive Prompts:**
1. "Run tests with coverage?" (yes/no, default: yes)
2. "Run in watch mode?" (yes/no, default: no)

**Actions Performed:**
1. Execute `npm test` or `npm run test:coverage`
2. Display test results
3. Show coverage summary
4. Highlight files below coverage threshold

**Expected Output:**
```
Running tests with coverage...

Test Suites: 5 passed, 5 total
Tests:       42 passed, 42 total
Coverage:    85.2% statements
             82.1% branches
             88.5% functions
             85.7% lines

✅ All coverage thresholds met (80% minimum)

Coverage report: coverage/index.html
```

---

### `/check-quality`

**Description:** Runs quality checks including linting, type checking, and build verification.

**Usage:**
```
/check-quality
```

**Actions Performed:**
1. Run TypeScript type checking (`tsc --noEmit`)
2. Run build (`npm run build`)
3. Check for errors in output
4. Verify all guidelines are followed

**Expected Output:**
```
Quality Checks:

✅ TypeScript: No type errors
✅ Build: Successful
✅ Coding Guidelines: Followed
✅ File Structure: Correct

All quality checks passed!
```

---

## Development Server

### `/start-dev`

**Description:** Starts the development server and opens the application.

**Usage:**
```
/start-dev
```

**Interactive Prompts:**
1. "Open browser automatically?" (yes/no, default: yes)

**Actions Performed:**
1. Run `npm run build` to compile latest changes
2. Start `npm run serve` in background
3. Optionally open browser to `http://localhost:8080`
4. Display server information

**Expected Output:**
```
Building application...
✅ Build complete

Starting development server...
🚀 Server running at http://localhost:8080

Press Ctrl+C to stop the server
```

---

## Documentation

### `/update-prompts`

**Description:** Updates the Prompts.md file with the latest prompt sequence used.

**Usage:**
```
/update-prompts
```

**Interactive Prompts:**
1. "What was the last prompt you used?"
2. "What version number should this be?" (auto-increments)

**Actions Performed:**
1. Add new prompt to `AIPrompt/Prompts.md`
2. Update version history
3. Update example usage flow if needed

**Expected Output:**
```
✅ Added Prompt 8 to AIPrompt/Prompts.md
✅ Updated version history to v1.3
✅ Updated example usage flow

Prompts.md has been updated!
```

---

### `/generate-readme`

**Description:** Creates or updates README.md based on current project state.

**Usage:**
```
/generate-readme
```

**Actions Performed:**
1. Read `DevelopmentPlan.md` and `CreatedIdeation.md`
2. Scan current codebase for features
3. Generate comprehensive README with:
   - Project description
   - Features
   - Installation instructions
   - Usage guide
   - Development setup
   - Testing instructions
   - Technology stack

**Expected Output:**
```
✅ Generated README.md

Sections included:
- Project Overview
- Features (based on implemented sprints)
- Installation & Setup
- Usage Instructions
- Development Guide
- Testing
- Technology Stack
- License

README.md created successfully!
```

---

## Deployment

### `/prepare-deploy`

**Description:** Prepares the application for deployment.

**Usage:**
```
/prepare-deploy
```

**Interactive Prompts:**
1. "Run tests before deployment?" (yes/no, default: yes)
2. "Target environment?" (development/staging/production)

**Actions Performed:**
1. Run full test suite
2. Verify test coverage meets threshold
3. Run production build
4. Verify build output
5. Create deployment checklist

**Expected Output:**
```
Preparing for deployment...

✅ Tests passed (42/42)
✅ Coverage: 85% (threshold: 80%)
✅ Production build successful
✅ Build artifacts verified

Deployment Checklist:
✅ All tests passing
✅ Coverage threshold met
✅ Build artifacts ready
✅ No console errors
✅ No TypeScript errors

Ready for deployment!
Files to deploy: dist/
```

---

## Utility Commands

### `/clean`

**Description:** Cleans build artifacts and caches.

**Usage:**
```
/clean
```

**Interactive Prompts:**
1. "Also clean node_modules?" (yes/no, default: no)

**Actions Performed:**
1. Run `npm run clean` (removes dist/ and coverage/)
2. Optionally remove node_modules
3. Display cleaned directories

**Expected Output:**
```
Cleaning build artifacts...

✅ Removed dist/
✅ Removed coverage/

Clean complete!
```

---

### `/status`

**Description:** Shows current project status and progress.

**Usage:**
```
/status
```

**Actions Performed:**
1. Detect completed sprints
2. Show test coverage
3. List pending tasks
4. Show git branch and commit status

**Expected Output:**
```
📊 Project Status: Rocksmith File Manager

Progress:
✅ Sprint 1: Complete
✅ Sprint 2: Complete
🔄 Sprint 3: In Progress (2/4 tasks)
⏸️ Sprint 4: Not Started
⏸️ Sprint 5: Not Started

Test Coverage: 65% (target: 80%)
Build Status: ✅ Passing
Git Branch: sprints1-2
Uncommitted Changes: 3 files

Next Steps:
- Complete Sprint 3 Task 3.3
- Complete Sprint 3 Task 3.4
```

---

## Advanced Commands

### `/refactor`

**Description:** Suggests or performs refactoring based on code analysis.

**Parameters:**
- `file` (optional): Specific file to refactor

**Usage:**
```
/refactor
```

**Interactive Prompts:**
1. "Which file do you want to refactor?" (or "all" for suggestions)
2. "Apply refactoring automatically?" (yes/no)

**Actions Performed:**
1. Analyze code for refactoring opportunities
2. Suggest improvements based on guidelines
3. Optionally apply automated refactorings

---

### `/add-feature`

**Description:** Scaffolds a new feature following project conventions.

**Usage:**
```
/add-feature
```

**Interactive Prompts:**
1. "What is the feature name?"
2. "Does it need a new service module?" (yes/no)
3. "Does it need UI components?" (yes/no)
4. "Does it need new types?" (yes/no)

**Actions Performed:**
1. Create necessary files following project structure
2. Add boilerplate code following guidelines
3. Update imports in main.ts
4. Create test file scaffolding

---

## Quick Reference

| Command | Description | Sprint Required |
|---------|-------------|-----------------|
| `/create-project` | Generate all project documentation | None |
| `/perform-sprint` | Execute a specific sprint | Varies |
| `/next-sprint` | Execute next sprint in sequence | Previous sprint |
| `/review-sprint` | Review sprint completion | Sprint completed |
| `/run-tests` | Run test suite with coverage | Sprint 5 |
| `/check-quality` | Run quality checks | Any |
| `/start-dev` | Start development server | Sprint 2+ |
| `/update-prompts` | Update Prompts.md | Any |
| `/generate-readme` | Create/update README | Any |
| `/prepare-deploy` | Prepare for deployment | Sprint 5 |
| `/clean` | Clean build artifacts | Any |
| `/status` | Show project status | Any |
| `/refactor` | Refactor code | Any |
| `/add-feature` | Scaffold new feature | Sprint 2+ |

---

## Usage Tips

1. **Sequential Execution**: Use `/perform-sprint` or `/next-sprint` to execute sprints in order
2. **Quality Assurance**: Run `/check-quality` before committing code
3. **Progress Tracking**: Use `/status` to see overall project progress
4. **Testing**: Use `/run-tests` regularly, especially after implementing features
5. **Documentation**: Keep prompts updated with `/update-prompts` for reusability

---

## Custom Slash Prompts

You can create custom slash prompts by following this template:

```
### `/your-command`

**Description:** What this command does

**Parameters:**
- `param-name` (required/optional): Description

**Usage:**
```
/your-command
```

**Interactive Prompts:**
1. "First question?"
2. "Second question?"

**Actions Performed:**
1. Step 1
2. Step 2
3. Step 3

**Expected Output:**
```
Example output...
```
```

---

**Created:** February 5, 2026  
**Last Updated:** February 5, 2026  
**Version:** 1.0

---

**Note:** These slash prompts are designed for use with AI assistants that support interactive workflows. Actual implementation may vary based on the AI assistant's capabilities.
