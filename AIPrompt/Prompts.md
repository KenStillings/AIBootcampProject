# AI Prompts for Project Development

This document contains a sequence of reusable prompts for generating comprehensive project documentation from an initial idea. These prompts guide the AI through creating ideation documents, development plans, task breakdowns, and sprint plans.

---

## Prerequisites

Before starting, create a `GeneralIdea.txt` file that describes your project concept, including:
- What the application should do
- Key features and requirements
- User interactions
- Technology preferences
- Any specific design requirements (UI/UX elements)

---

## Prompt Sequence

### Prompt 1: Create Ideation Document

```
I have a prompt created in GeneralIdea.txt.

Is there enough in there to create an ideation file? If so, create a new file called CreatedIdeation.md, and add a good description of what would need to be done.
```

**Expected Output:** 
- `CreatedIdeation.md` file containing:
  - Project overview
  - Core features breakdown
  - Technical requirements
  - User interface components
  - Core functions to develop
  - User workflow
  - Development phases
  - Success criteria
  - Future enhancements

---

### Prompt 2: Generate Development Plan

```
Nice. Please take the CreatedIdeation.md and create a development plan. Write that plan to DevelopmentPlan.md
```

**Expected Output:**
- `DevelopmentPlan.md` file containing:
  - Project information (name, version, timeline, tech stack)
  - Sprint overview (5 sprints recommended)
  - Detailed task breakdown for each sprint
  - Task estimates and priorities
  - Dependencies between tasks
  - Subtasks and acceptance criteria
  - Risk management section
  - Quality assurance checklist
  - Success metrics
  - Post-launch roadmap
  - Resource requirements

---

### Prompt 3: Add Testing Requirements

```
In the development plan, add requirements for testing. I'd like to see 80% test coverage.
```

**Expected Output:**
- Updated `DevelopmentPlan.md` with:
  - Testing requirements section
  - Code coverage standards (80% minimum)
  - Testing frameworks specification
  - Coverage reporting requirements
  - Critical modules requiring 100% coverage
  - Test types required (unit, integration, edge cases)
  - Unit tests distributed across Sprints 3-4 (test alongside feature development)
  - Integration testing and coverage validation in Sprint 5
  - Coverage validation steps
  - Testing commands and scripts

**Testing Approach:**
- Sprint 1: Testing framework setup
- Sprint 2: Feature development (tests deferred)
- Sprint 3: Status features + unit tests for Sprints 2-3
- Sprint 4: Bulk import features + unit tests for Sprint 4
- Sprint 5: Integration testing and coverage validation

**Note:** Adjust the coverage percentage (80%) to match your project's requirements.

---

### Prompt 4: Create Sprint Task Plans

```
Using the DevelopmentPlan.md create a task plan for each of the sprints.
```

**Expected Output:**
- Individual detailed task plan files:
  - `Sprint1-TaskPlan.md` (Project Setup & Foundation)
  - `Sprint2-TaskPlan.md` (Core Functionality)
  - `Sprint3-TaskPlan.md` (Status Management & Persistence)
  - `Sprint4-TaskPlan.md` (Bulk Import & Polish)
  - `Sprint5-TaskPlan.md` (Testing & Deployment)

**Each Sprint Plan Contains:**
- Sprint overview and goals
- Prerequisites from previous sprints
- Detailed task breakdowns with:
  - Estimated time
  - Priority level
  - Dependencies
  - Subtask checklists
  - Code templates and examples
  - Acceptance criteria
  - Deliverables
  - Testing tasks (Sprints 3-4 include unit tests, Sprint 5 includes integration tests)
- Sprint completion checklist
- Integration tasks
- Quality checks
- Troubleshooting guide
- Preview of next sprint

---

### Prompt 5: Organize Documentation

```
Please move each of the created files - Sprint1 through Sprint5, CreatedIdeation.md and DevelopmentPlan.md into the GeneratedDocs folder
```

**Expected Output:**
- All generated documentation moved to `GeneratedDocs/` folder:
  - `CreatedIdeation.md`
  - `DevelopmentPlan.md`
  - `Sprint1-TaskPlan.md`
  - `Sprint2-TaskPlan.md`
  - `Sprint3-TaskPlan.md`
  - `Sprint4-TaskPlan.md`
  - `Sprint5-TaskPlan.md`

---

### Prompt 6: Set Development Guidelines

```
Moving forward, please use the guidelines in the Docs directory as your development guidelines.
```

**Purpose:** Instructs the AI to follow project-specific coding standards, testing requirements, and UI/UX guidelines for all future development work.

**Expected Output:**
- AI acknowledges and confirms understanding of guidelines
- AI will apply guidelines from these files to all code generation:
  - `Docs/coding-guidelines.md` - Coding standards and best practices
  - `Docs/testing-guidelines.md` - Testing strategy and coverage requirements
  - `Docs/ui-guidelines.md` - UI/UX design specifications

**When to Use:**
- After creating initial project documentation
- Before starting actual code implementation
- When you have project-specific standards to enforce

**Note:** This prompt assumes you have a `Docs/` directory with guideline files. If not, create them first or reference wherever your guidelines are stored.

---

### Prompt 7: Implement Sprint Tasks

```
Using the guidelines provided, please implement the tasks in Sprint[N]-TaskPlan.md
```

**Purpose:** Executes the actual implementation of a specific sprint's tasks following established coding, testing, and UI guidelines.

**Expected Output:**
- All source code files created as specified in the sprint plan
- TypeScript/JavaScript modules with proper structure and documentation
- CSS styling following design guidelines
- Build configuration successful
- Development server setup (if applicable)
- Initial verification that code compiles and runs

**Sprint-Specific Examples:**

**Sprint 1 - Project Setup:**
```
Using the guidelines provided, please implement the tasks in Sprint1-TaskPlan.md
```
- Creates project structure, package.json, tsconfig.json, jest.config.js
- Sets up TypeScript types and interfaces
- Creates HTML structure and CSS framework
- Configures test framework with 80% coverage threshold

**Sprint 2 - Core Functionality:**
```
Using the guidelines provided, please implement the tasks in Sprint2-TaskPlan.md
```
- Implements data service module (CRUD operations)
- Creates UI event handlers and validation
- Builds rendering logic for dynamic content
- Sets up development server for testing
- Note: Unit tests for Sprint 2 will be created in Sprint 3

**Sprint 3 - Status Management & Unit Tests:**
```
Using the guidelines provided, please implement the tasks in Sprint3-TaskPlan.md
```
- Implements status updates and persistence
- Creates comprehensive unit tests for Sprints 2-3 features
- Achieves 80%+ test coverage for core modules
- Validates all CRUD operations with tests

**Sprint 4 - Bulk Import & Unit Tests:**
```
Using the guidelines provided, please implement the tasks in Sprint4-TaskPlan.md
```
- Implements CSV parser and bulk import
- Creates search/filter functionality
- Polishes UI with animations and enhancements
- Adds unit tests for CSV parser and filters
- Maintains 80%+ overall test coverage

**When to Use:**
- After completing all planning documentation
- After setting development guidelines (Prompt 6)
- When ready to begin actual code implementation
- At the start of each new sprint

**Best Practices:**
- Complete sprints sequentially (Sprint 1 → Sprint 2 → Sprint 3, etc.)
- Verify build and functionality before moving to next sprint
- Review generated code against guidelines
- Test features manually or via unit tests
- Commit code to version control after each sprint

**Note:** Replace [N] with the sprint number (1, 2, 3, 4, or 5). Always complete prerequisites from previous sprints before starting a new sprint.

---

## Customization Options

You can customize these prompts by:

### Adjusting Test Coverage
Replace "80%" with your desired coverage percentage:
```
I'd like to see [X]% test coverage.
```

### Changing Sprint Count
Modify the development plan prompt:
```
Create a development plan with [X] sprints instead of 5.
```

### Adding Specific Requirements
Add to any prompt:
```
Also include [specific requirement] in the [document name].
```

### Technology Stack Changes
Update the GeneralIdea.txt with your preferred technologies, or add to prompts:
```
Use [technology] instead of [default technology].
```

---

## Example Usage Flow

1. **Prepare:** Write your project idea in `GeneralIdea.txt`
2. **Generate Ideation:** Use Prompt 1 → Creates `CreatedIdeation.md`
3. **Generate Dev Plan:** Use Prompt 2 → Creates `DevelopmentPlan.md`
4. **Add Testing:** Use Prompt 3 → Updates `DevelopmentPlan.md` with testing requirements
5. **Create Sprint Plans:** Use Prompt 4 → Creates 5 sprint task plan files
6. **Organize:** Use Prompt 5 → Moves all files to `GeneratedDocs/` folder
7. **Set Guidelines:** Use Prompt 6 → Instructs AI to follow project-specific guidelines for all future development
8. **Implement Sprints:** Use Prompt 7 → Execute each sprint's tasks sequentially (Sprint 1 → Sprint 2 → Sprint 3 → Sprint 4 → Sprint 5)

---

## Tips for Best Results

### Writing GeneralIdea.txt
- Be specific about features and functionality
- Include user stories or use cases
- Mention any UI/UX preferences
- Specify technology constraints or preferences
- Note any integration requirements

### During Prompt Sequence
- Review each generated document before moving to the next prompt
- Ask for clarifications or additions as needed
- Adjust prompts based on your specific project needs
- Don't hesitate to iterate on any document

### After Generation
- Use the Sprint plans as actual working documents
- Check off tasks as you complete them
- Update estimates based on actual time spent
- Document any deviations from the plan

---

## Project Types This Works For

This prompt sequence is particularly effective for:
- ✅ Web applications (frontend or full-stack)
- ✅ Mobile applications
- ✅ Desktop applications
- ✅ Command-line tools
- ✅ Libraries or frameworks
- ✅ API services
- ✅ Data processing pipelines

Adjust sprint focus areas based on your specific project type.

---

## Additional Prompts (Optional)

### Add Architecture Diagram
```
Create an architecture diagram description for the [project name] in the DevelopmentPlan.md
```

### Generate README
```
Create a comprehensive README.md file based on the DevelopmentPlan.md
```

### Create Database Schema
```
Based on the data model in the ideation document, create a database schema file
```

### Generate User Stories
```
Create detailed user stories based on the features in CreatedIdeation.md
```

---

## Version History

- **v1.3** (2026-02-05): Updated testing approach
  - Unit tests now distributed across Sprints 3-4
  - Tests written alongside features for better quality
  - Sprint 5 focuses on integration testing and coverage validation
  - Updated prompt examples to reflect test-driven development

- **v1.3** (2026-02-05): Updated testing approach
  - Unit tests now distributed across Sprints 3-4
  - Tests written alongside features for better quality
  - Sprint 5 focuses on integration testing and coverage validation
  - Updated prompt examples to reflect test-driven development

- **v1.2** (2026-02-05): Added Prompt 7 for sprint implementation
  - New prompt to execute actual coding tasks from sprint plans
  - Sprint-specific examples for different implementation phases
  - Best practices for sequential sprint execution
  - Updated usage flow to include implementation step

- **v1.1** (2026-02-05): Added Prompt 6 for setting development guidelines
  - New prompt to reference project-specific coding, testing, and UI guidelines
  - Updated usage flow to include guideline setup step
  
- **v1.0** (2026-02-05): Initial prompt sequence for Rocksmith File Manager project
  - 5-prompt sequence
  - Sprint-based development approach
  - 80% test coverage requirement
  - TypeScript/JavaScript focus

---

## Notes

- These prompts assume a 4-6 week development timeline
- Adjust sprint durations based on your team size and availability
- Test coverage percentage can be modified to suit project needs
- Sprint count and focus areas can be customized
- Works best with AI assistants that have context awareness

---

**Created:** February 5, 2026  
**Last Updated:** February 5, 2026  
**Purpose:** Standardized project documentation generation
