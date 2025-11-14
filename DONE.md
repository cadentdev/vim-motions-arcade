# Done

Completed tasks, with headers for organization and context.

## Phase 0: Project Setup & Architecture

### 1. Project Initialization

- [x] Initialize project structure (src, assets, tests directories)
- [x] Set up build tooling (Vite recommended for modern dev experience)
- [x] Set up linting (ESLint) and formatting (Prettier)
- [x] Create package.json with necessary dependencies
- [x] Set up Git hooks for code quality (husky + lint-staged)
- [x] Configure for ES modules (type="module" in package.json)

### 2. Development Environment

- [x] Configure hot module replacement for rapid iteration
- [x] Set up basic HTML template with game container
- [x] Configure Vite dev server (static file server only - no backend needed)
- [x] Add source maps for debugging

### 2a. Testing Infrastructure

- [x] Set up Vitest for unit testing
  - Configure vitest.config.js
  - Set up watch mode for development
  - Create test directory structure (tests/unit/, tests/e2e/)
- [x] Set up Playwright for E2E testing
  - Install Playwright and browsers
  - Configure playwright.config.js
  - Create basic E2E test scaffold
- [x] Configure Git hooks
  - Pre-commit: Run linter + unit tests (temporarily disabled for TDD)
  - Pre-push: Run E2E tests (deployment gate, currently skipped)
- [x] Add optional jsconfig.json for IntelliSense
  - Enable better autocomplete for VS Code
  - Keep type checking optional (no checkJs by default)

### 3. Core Architecture Planning

- [x] Define core game state structure
  - Player position (x, y coordinates)
  - Score, timer, health
  - Available motions/power-ups
  - Level state
- [x] Design rendering strategy decision
  - Start with DOM-based rendering (per PRD recommendation)
  - Structure code to allow Canvas migration later
- [x] Plan input handling system
  - Keyboard event listeners
  - Mode-specific input handlers (normal/command/visual/insert)
  - Input buffer for combo execution
- [x] Define game loop architecture
  - Update cycle (game state)
  - Render cycle (visual updates)
  - Fixed timestep vs variable timestep decision
