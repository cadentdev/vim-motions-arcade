# Vim Motions Arcade - Development Tasks

This document outlines the initial development tasks for building the Vim Motions Arcade game, based on the PRD specifications. These tasks focus on establishing the foundation and delivering Phase 1: Core Prototype (MVP).

---

## Phase 0: Project Setup & Architecture

### 1. Project Initialization
- [ ] Initialize project structure (src, assets, tests directories)
- [ ] Set up build tooling (Vite recommended for modern dev experience)
- [ ] Set up linting (ESLint) and formatting (Prettier)
- [ ] Create package.json with necessary dependencies
- [ ] Set up Git hooks for code quality (husky + lint-staged)
- [ ] Configure for ES modules (type="module" in package.json)

### 2. Development Environment
- [ ] Configure hot module replacement for rapid iteration
- [ ] Set up basic HTML template with game container
- [ ] Configure Vite dev server (static file server only - no backend needed)
- [ ] Add source maps for debugging

### 2a. Testing Infrastructure
- [ ] Set up Vitest for unit testing
  - Configure vitest.config.js
  - Set up watch mode for development
  - Create test directory structure (tests/unit/, tests/e2e/)
- [ ] Set up Playwright for E2E testing
  - Install Playwright and browsers
  - Configure playwright.config.js
  - Create basic E2E test scaffold
- [ ] Configure Git hooks
  - Pre-commit: Run linter + unit tests
  - Pre-push: Run E2E tests (deployment gate)
- [ ] Add optional jsconfig.json for IntelliSense
  - Enable better autocomplete for VS Code
  - Keep type checking optional (no checkJs by default)

### 3. Core Architecture Planning
- [ ] Define core game state structure
  - Player position (x, y coordinates)
  - Score, timer, health
  - Available motions/power-ups
  - Level state
- [ ] Design rendering strategy decision
  - Start with DOM-based rendering (per PRD recommendation)
  - Structure code to allow Canvas migration later
- [ ] Plan input handling system
  - Keyboard event listeners
  - Mode-specific input handlers (normal/command/visual/insert)
  - Input buffer for combo execution
- [ ] Define game loop architecture
  - Update cycle (game state)
  - Render cycle (visual updates)
  - Fixed timestep vs variable timestep decision

---

## Phase 1: Core Prototype (MVP)

**Development Philosophy**: Build from outside-in. Start with screens and navigation, then add game mechanics.

### 4. Screen Management System

#### 4.1 Screen Manager/Router
- [ ] Create ScreenManager class/module
- [ ] Define screen states (MAIN_MENU, PLAYING, LEVEL_COMPLETE, LEVEL_FAILED)
- [ ] Implement screen switching logic
- [ ] Handle screen transitions (show/hide DOM elements)
- [ ] Add screen-specific event listener management (attach/detach)

#### 4.2 Unit Tests for Screen Management
- [ ] Test screen transitions (MAIN_MENU → PLAYING → COMPLETE/FAILED)
- [ ] Test invalid screen transitions are prevented
- [ ] Test event listeners are properly cleaned up on screen change

### 5. Main Menu Screen

#### 5.1 Main Menu UI
- [ ] Create main menu HTML structure
- [ ] Add title/logo area
- [ ] Create "Start New Game" button
- [ ] Create "Continue Game" button (disabled if no save exists)
- [ ] Add basic instructions section (controls overview)
- [ ] Style menu with retro/vim aesthetic

#### 5.2 Local Leaderboard Display
- [ ] Create leaderboard section (top 10 scores)
- [ ] Display rank, score, level reached, date
- [ ] Handle empty leaderboard (no games played yet)
- [ ] Style leaderboard table/list

#### 5.3 Main Menu Functionality
- [ ] Wire up "Start New Game" button click
- [ ] Wire up "Continue Game" button click
- [ ] Check for existing save on menu load (enable/disable continue button)
- [ ] Load and display leaderboard data

### 6. LocalStorage & Save System

#### 6.1 Save/Load Infrastructure
- [ ] Create SaveManager class/module
- [ ] Implement save game data structure
  - Current level, score, unlocked motions, XP
- [ ] Implement saveGame() function (write to localStorage)
- [ ] Implement loadGame() function (read from localStorage)
- [ ] Implement hasSave() function (check if save exists)

#### 6.2 Leaderboard System
- [ ] Create Leaderboard class/module
- [ ] Implement leaderboard data structure (array of entries)
- [ ] Implement addScore() function (add new score, sort, keep top 10)
- [ ] Implement getTopScores() function (retrieve top 10)
- [ ] Implement clearLeaderboard() function (for testing)

#### 6.3 Unit Tests for Save System
- [ ] Test save/load round-trip (save data, load data, verify match)
- [ ] Test hasSave() returns correct boolean
- [ ] Test leaderboard sorting (highest score first)
- [ ] Test leaderboard limits to top 10 entries
- [ ] Test saving when localStorage is full/unavailable

### 7. Command Mode & Tutorial Level 0

#### 7.1 Command Mode Infrastructure
- [ ] Create CommandMode class/module
- [ ] Detect `:` key press to enter command mode
- [ ] Create command input overlay/prompt
- [ ] Implement command parsing (split on spaces, handle args)
- [ ] Handle Esc to exit command mode
- [ ] Display command feedback (success/error messages)

#### 7.2 Implement Core Commands
- [ ] Implement `:q` command (quit to main menu)
- [ ] Implement `:quit` command (alias for :q)
- [ ] Implement `:help` command (show available commands)
- [ ] Handle unknown commands (error message)

#### 7.3 Tutorial Level 0: "How to Quit Vim"
- [ ] Create tutorial level 0 content
  - Simple screen with text: "Welcome to Vim Motions Arcade!"
  - Instructions: "Type :q and press Enter to quit"
- [ ] Render tutorial screen (no map, no coins, just text)
- [ ] Detect successful `:q` command
- [ ] Return to main menu on success
- [ ] Mark tutorial as complete (save to localStorage)

#### 7.4 Unit Tests for Command Mode
- [ ] Test command parsing (`:q`, `:quit`, `:help`)
- [ ] Test command execution (correct function called)
- [ ] Test unknown command handling
- [ ] Test Esc exits command mode

### 8. Game Screen Container

#### 8.1 Game Screen Structure
- [ ] Create game screen HTML container
- [ ] Add game area (where map/player will render)
- [ ] Create HUD container (fixed position overlay)
- [ ] Set up basic layout (game area + HUD)
- [ ] Style game screen (background, borders, etc.)

#### 8.2 Game Screen Lifecycle
- [ ] Implement enterGameScreen() function
- [ ] Implement exitGameScreen() function (cleanup, return to menu)
- [ ] Wire up screen transitions from menu
- [ ] Test screen switching (menu → game → menu)

### 9. Map Generation System

#### 9.1 Basic Map Structure
- [ ] Create Map class/module
- [ ] Implement simple grid system (character-based coordinates)
- [ ] Define block/word data structure
  - Position, width, type (word/obstacle)
- [ ] Generate static test map for initial development
- [ ] Implement basic procedural generation
  - Random block placement with spacing
  - Ensure document-like structure (words separated by spaces)
  - Add blank lines (for future paragraph navigation)

#### 9.2 Map Rendering (DOM-based)
- [ ] Create DOM elements for map blocks
- [ ] Apply monospace styling for alignment
- [ ] Implement block rendering from map data
- [ ] Add basic styling (colors, spacing)
- [ ] Create viewport/camera system
  - Center view on player cursor
  - Handle map scrolling for larger documents

### 10. Player Character System

#### 10.1 Cursor Block Implementation
- [ ] Create Player/Cursor class
- [ ] Render cursor block with distinct styling
- [ ] Position cursor on character grid
- [ ] Implement z-index layering (cursor above map blocks)

#### 10.2 Basic Movement (hjkl)
- [ ] Set up keyboard event listeners
- [ ] Implement `h` (left) movement
  - Update player position
  - Validate movement (grid boundaries, obstacles)
  - Re-render cursor position
- [ ] Implement `j` (down) movement
- [ ] Implement `k` (up) movement
- [ ] Implement `l` (right) movement
- [ ] Add movement validation
  - Prevent out-of-bounds movement
  - Collision detection with blocks (for future obstacles)
- [ ] Implement smooth cursor transitions
  - CSS transitions for movement
  - Duration based on distance traveled

#### 10.3 Unit Tests for Player Movement
- [ ] Test player position updates for each direction (h, j, k, l)
- [ ] Test boundary collision detection (prevent out-of-bounds)
- [ ] Test movement validation with obstacles
- [ ] Test player initialization at correct starting position

### 11. Collectibles & Scoring

#### 11.1 Coin System
- [ ] Create Coin class/data structure
- [ ] Implement coin placement in map generation
  - Place at word boundaries initially
  - Random distribution with strategic placement
- [ ] Render coins as DOM elements
- [ ] Implement collection detection
  - Check cursor position vs coin positions each frame
  - Remove collected coins from map
  - Trigger collection event

#### 11.2 Basic Scoring
- [ ] Create Score class/module
- [ ] Implement point awarding on coin collection
  - Base points per coin (10pts)
- [ ] Track total coins collected
- [ ] Track remaining coins (for win condition)

#### 11.3 Unit Tests for Coins & Scoring
- [ ] Test coin collection detection (position overlap)
- [ ] Test score increments correctly on collection
- [ ] Test coin removal from map after collection
- [ ] Test tracking of remaining coins
- [ ] Test win condition (all coins collected)

### 12. Timer System
- [ ] Create Timer class
- [ ] Implement countdown from 60 seconds
- [ ] Pause timer functionality
- [ ] Timer completion callback (lose condition)
- [ ] Format time display (MM:SS)

#### 12.1 Unit Tests for Timer
- [ ] Test timer countdown accuracy
- [ ] Test pause/resume functionality
- [ ] Test timer completion triggers callback
- [ ] Test time formatting (MM:SS display)

### 13. User Interface (HUD)

#### 13.1 Basic HUD Elements
- [ ] Create HUD container (fixed position overlay)
- [ ] Implement score display (top-right)
  - Current score
  - Update on score change
- [ ] Implement timer display (top-center)
  - Countdown display
  - Color coding (green → yellow → red as time decreases)
- [ ] Add basic styling for HUD elements
  - Modern, clean design
  - High contrast for readability

#### 13.2 Mode Indicator
- [ ] Create mode indicator element (bottom-left)
- [ ] Display "NORMAL" mode (Phase 1 only has Normal mode)
- [ ] Style with distinct color

### 14. Game Loop & State Management

#### 14.1 Game Loop
- [ ] Implement requestAnimationFrame-based game loop
- [ ] Create update() function
  - Update timer
  - Check win/lose conditions
  - Handle collision detection
- [ ] Create render() function
  - Update DOM based on game state
  - Re-render only changed elements (performance)
- [ ] Implement frame rate monitoring (for debugging)

#### 14.2 State Management
- [ ] Create GameState class/store
- [ ] Implement state transitions
  - MENU → PLAYING
  - PLAYING → LEVEL_COMPLETE
  - PLAYING → LEVEL_FAILED
- [ ] Handle state-specific rendering
- [ ] Implement state persistence (for pause/resume)

#### 14.3 Unit Tests for State Management
- [ ] Test state transitions (MENU → PLAYING → COMPLETE/FAILED)
- [ ] Test invalid state transitions are prevented
- [ ] Test state persistence on pause/resume
- [ ] Test game state initialization

### 15. Win/Lose Conditions

#### 15.1 Win Condition
- [ ] Detect when all coins collected
- [ ] Trigger level complete state
- [ ] Display "Level Complete" message
- [ ] Show final score
- [ ] Add "Restart" button/option

#### 15.2 Lose Condition
- [ ] Detect when timer reaches zero
- [ ] Trigger level failed state
- [ ] Display "Time's Up" message
- [ ] Show final score (coins collected)
- [ ] Add "Retry" button/option

#### 15.3 Unit Tests for Win/Lose Conditions
- [ ] Test win condition triggers when all coins collected
- [ ] Test lose condition triggers when timer reaches zero
- [ ] Test correct final score calculation
- [ ] Test state transitions to LEVEL_COMPLETE and LEVEL_FAILED

### 16. Level End Screens
- [ ] Create level complete screen template
  - Score display
  - "Next Level" button (restarts for MVP)
  - "Main Menu" button
- [ ] Create level failed screen template
  - Score display
  - "Retry" button
  - "Main Menu" button

---

## Phase 1: Testing & Polish

### 17. Playtesting & Iteration
- [ ] Playtest core loop for fun factor
- [ ] Adjust timing (movement speed, timer duration)
- [ ] Tune difficulty (map size, coin placement)
- [ ] Verify controls feel responsive
- [ ] Test on different screen sizes

### 18. Bug Fixes & Edge Cases
- [ ] Test boundary conditions (map edges)
- [ ] Handle rapid key presses
- [ ] Test pause/resume functionality
- [ ] Verify state transitions work correctly
- [ ] Test with different keyboard layouts

### 19. E2E Tests (Deployment Gate)
- [ ] Write E2E test: Tutorial Level 0 (start → type :q → return to menu)
- [ ] Write E2E test: Menu navigation (main menu → game → back to menu)
- [ ] Write E2E test: Continue game (save exists → continue button enabled → loads game)
- [ ] Write E2E test: Happy path (start → collect all coins → win)
- [ ] Write E2E test: Timeout path (start → timer expires → lose)
- [ ] Write E2E test: Restart flow (complete level → restart → game works)
- [ ] Write E2E test: Movement (hjkl keys move cursor correctly)
- [ ] Write E2E test: Leaderboard (complete game → score appears in leaderboard)
- [ ] Verify E2E tests run in pre-push hook
- [ ] Ensure E2E tests block push if failing

### 20. Code Quality
- [ ] Add JSDoc comments to core functions/classes
- [ ] Refactor duplicated code
- [ ] Ensure consistent naming conventions
- [ ] Run linter and fix issues
- [ ] Basic performance profiling

### 21. Documentation
- [ ] Update README with setup instructions
- [ ] Document development commands (dev, build, test)
- [ ] Add controls reference for players
- [ ] Create basic architecture diagram

---

## Phase 1 Success Criteria (from PRD)
✅ Playable game with responsive controls
✅ Core loop is engaging (navigate → collect → score)
✅ Single level that restarts on completion/failure
✅ Basic hjkl movement feels good
✅ Timer and scoring work correctly

---

## Next Phases (Future Work)

### Phase 2: Power-up System
- Word-based movements (w, b, e)
- Power-up collection and unlocking
- Cooldown system with badges
- Tutorial popups
- 5 progressive levels

### Phase 3: Visual Polish
- Movement effects (rocket, blur, jello)
- Particle effects
- Sound effects and music
- Combo system
- Theme system

### Phase 4: Advanced Mechanics
- Visual mode, Insert mode
- Line/paragraph jumps
- Obstacles and health system
- 15 total levels

### Phase 5: Progression & Polish
- XP and leveling
- Persistent unlocks
- Leaderboards
- Achievements
- 25+ levels

### Phase 6: Community & Content
- Daily challenges
- Speedrun mode
- Social features

---

## Notes

### Technology Decisions
- **Language**: Vanilla JavaScript (modern ES modules)
  - Start simple, add TypeScript later only if needed
  - Optional: Use `// @ts-check` for type checking in individual files
  - Migration path: Convert to TypeScript in later phases if complexity warrants it
- **Framework**: No framework - vanilla HTML/CSS/JS
  - Can migrate to React/Svelte later if complexity demands it
- **Architecture**: Client-side only (no backend server)
  - Phases 1-4: Pure browser-based game
  - Vite dev server serves static files only (HTML/CSS/JS)
  - Game state stored in-memory and localStorage
  - Backend only needed in Phase 5+ for user accounts/leaderboards
- **Rendering**: DOM-based for MVP (evaluate Canvas in Phase 3)
- **Styling**: CSS with CSS variables for theming support
- **State**: Simple class-based state (can migrate to Redux/Zustand later)
- **Testing**: Two-tier strategy
  - **Unit tests** (Vitest): Development feedback loop, run in watch mode and on pre-commit
  - **E2E tests** (Playwright): Deployment gate, run on pre-push hook to prevent broken builds
  - Focus unit tests on game logic, E2E tests on critical user flows

### Development Principles
1. **Start Simple**: Keep things as simple as possible, but not too simple
2. **Iterative Development**: Build, playtest, refine
3. **Fun First**: Prioritize gameplay feel over features
4. **Clean Code**: Maintain readability for future features
5. **Performance Aware**: Profile early, optimize as needed
6. **Modular Design**: Easy to extend with Phase 2+ features
7. **Add Complexity When Needed**: TypeScript, frameworks, etc. only when justified

### Open Questions for Phase 1
- Map size: How many characters wide/tall? (Start 40x20, adjust)
- Movement speed: Instant or animated? (CSS transitions ~100-200ms)
- Coin density: How many coins per map? (Start with 20-30)
- Timer: 60 seconds sufficient? (Start 60s, adjust based on playtesting)

---

**Status**: Ready to begin development
**Priority**: Complete Phase 0 and Phase 1 tasks in order
**Estimated Timeline**: 2-3 weeks for Phase 1 MVP
