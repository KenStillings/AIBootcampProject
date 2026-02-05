# GitHub Copilot Instructions for AIBootcampProject

## Custom Slash Commands

This project uses custom slash commands defined in `AIPrompt/slash-prompts.md`. When a user enters a command starting with `/`, refer to that file for the command definition and execute accordingly.

### Available Commands

Refer to [AIPrompt/slash-prompts.md](../AIPrompt/slash-prompts.md) for the complete list of slash commands including:

- `/create-project` - Generate complete project documentation
- `/perform-sprint` - Execute a specific sprint's tasks
- `/next-sprint` - Automatically run the next sprint
- `/review-sprint` - Review sprint completion
- `/run-tests` - Execute test suite with coverage
- `/check-quality` - Run quality checks
- `/start-dev` - Start development server
- `/status` - Show project status
- `/clean` - Clean build artifacts

### Command Execution

When a slash command is used:
1. Read the command definition from `AIPrompt/slash-prompts.md`
2. Follow the interactive prompts specified
3. Execute the actions listed
4. Provide the expected output format

### Project Guidelines

When implementing code or performing sprint tasks, always follow:
- `Docs/coding-guidelines.md` - Coding standards
- `Docs/testing-guidelines.md` - Testing requirements (80% coverage)
- `Docs/ui-guidelines.md` - UI/UX specifications

### Sprint Task Execution

Sprint tasks are defined in:
- `GeneratedDocs/Sprint1-TaskPlan.md` through `Sprint5-TaskPlan.md`
- `GeneratedDocs/DevelopmentPlan.md`

Follow the test-driven development approach:
- Sprint 1: Setup with test framework
- Sprint 2: Core features (tests in Sprint 3)
- Sprint 3: Status management + unit tests for Sprints 2-3
- Sprint 4: Bulk import + unit tests for Sprint 4
- Sprint 5: Integration testing and deployment

## Project Context

- **Project**: Rocksmith File Manager
- **Tech Stack**: TypeScript, HTML5, CSS3, Jest
- **Test Coverage Requirement**: 80% minimum
- **Working Directory**: `/rocksmith-file-manager`
