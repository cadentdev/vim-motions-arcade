# Vim Motions Arcade - Development Tasks

This document outlines the initial development tasks for building the Vim Motions Arcade game, based on the PRD specifications. These tasks focus on establishing the foundation and delivering Phase 1: Core Prototype (MVP).

---

---

## Phase 1: Core Prototype (MVP)

**Development Philosophy**: Build from outside-in. Start with screens and navigation, then add game mechanics.

### 4. Screen Management System ✅

#### 4.1 Screen Manager/Router

- [x] Create ScreenManager class/module
- [x] Define screen states (MAIN_MENU, PLAYING, LEVEL_COMPLETE, LEVEL_FAILED)
- [x] Implement screen switching logic
- [x] Handle screen transitions (show/hide DOM elements)
- [x] Add screen-specific event listener management (attach/detach)

#### 4.2 Unit Tests for Screen Management

- [x] Test screen transitions (MAIN_MENU → PLAYING → COMPLETE/FAILED)
- [x] Test invalid screen transitions are prevented
- [x] Test event listeners are properly cleaned up on screen change

### 5. Main Menu Screen ✅

#### 5.1 Main Menu UI

- [x] Create main menu HTML structure
- [x] Add title/logo area
- [x] Create "Start New Game" button
- [x] Create "Continue Game" button (disabled if no save exists)
- [x] Add basic instructions section (controls overview)
- [x] Style menu with retro/vim aesthetic

#### 5.2 Local Leaderboard Display

- [x] Create leaderboard section (top 10 scores)
- [x] Display rank, score, level reached, date
- [x] Handle empty leaderboard (no games played yet)
- [x] Style leaderboard table/list

#### 5.3 Main Menu Functionality

- [x] Wire up "Start New Game" button click
- [x] Wire up "Continue Game" button click
- [x] Check for existing save on menu load (enable/disable continue button)
- [x] Load and display leaderboard data

### 6. LocalStorage & Save System ✅

#### 6.1 Save/Load Infrastructure

- [x] Create SaveManager class/module
- [x] Implement save game data structure
  - Current level, score, unlocked motions, XP
- [x] Implement saveGame() function (write to localStorage)
- [x] Implement loadGame() function (read from localStorage)
- [x] Implement hasSave() function (check if save exists)

#### 6.2 Leaderboard System

- [x] Create Leaderboard class/module
- [x] Implement leaderboard data structure (array of entries)
- [x] Implement addScore() function (add new score, sort, keep top 10)
- [x] Implement getTopScores() function (retrieve top 10)
- [x] Implement clearLeaderboard() function (for testing)

#### 6.3 Unit Tests for Save System

- [x] Test save/load round-trip (save data, load data, verify match)
- [x] Test hasSave() returns correct boolean
- [x] Test leaderboard sorting (highest score first)
- [x] Test leaderboard limits to top 10 entries
- [x] Test saving when localStorage is full/unavailable

### 7. Command Mode & Tutorial Level 0 ✅

#### 7.1 Command Mode Infrastructure ✅

- [x] Create CommandMode class/module
- [x] Detect `:` key press to enter command mode
- [x] Create command input overlay/prompt
- [x] Implement command parsing (split on spaces, handle args)
- [x] Handle Esc to exit command mode
- [x] Display command feedback (success/error messages)

#### 7.2 Implement Core Commands ✅

- [x] Implement `:q` command (quit to main menu)
- [x] Implement `:quit` command (alias for :q)
- [x] Implement `:help` command (show available commands)
- [x] Handle unknown commands (error message)

#### 7.3 Tutorial Level 0: "How to Quit Vim" ✅

- [x] Create tutorial level 0 content
  - Simple screen with text: "Welcome to Vim Motions Arcade!"
  - Instructions: "Type :q and press Enter to quit"
- [x] Render tutorial screen (no map, no coins, just text)
- [x] Detect successful `:q` command
- [x] Return to main menu on success
- [x] Mark tutorial as complete (save to localStorage)

#### 7.4 Unit Tests for Command Mode ✅

- [x] Test command parsing (`:q`, `:quit`, `:help`)
- [x] Test command execution (correct function called)
- [x] Test unknown command handling
- [x] Test Esc exits command mode

### 8. Game Screen Container ✅

#### 8.1 Game Screen Structure ✅

- [x] Create game screen HTML container
- [x] Add game area (where map/player will render)
- [x] Create HUD container (fixed position overlay)
- [x] Set up basic layout (game area + HUD)
- [x] Style game screen (background, borders, etc.)

#### 8.2 Game Screen Lifecycle ✅

- [x] Implement enterGameScreen() function
- [x] Implement exitGameScreen() function (cleanup, return to menu)
- [x] Wire up screen transitions from menu
- [x] Test screen switching (menu → game → menu)

### 9. Map Generation System ✅

#### 9.1 Basic Map Structure ✅

- [x] Create Map class/module
- [x] Implement simple grid system (character-based coordinates)
- [x] Define block/word data structure
  - Position, width, type (word/obstacle)
- [x] Generate static test map for initial development
- [x] Implement basic procedural generation
  - Random block placement with spacing
  - Ensure document-like structure (words separated by spaces)
  - Add blank lines (for future paragraph navigation)

#### 9.2 Map Rendering (DOM-based) ✅

- [x] Create DOM elements for map blocks
- [x] Apply monospace styling for alignment
- [x] Implement block rendering from map data
- [x] Add basic styling (colors, spacing)
- [x] Create viewport/camera system
  - Center view on player cursor
  - Handle map scrolling for larger documents

### 10. Player Character System ✅

#### 10.1 Cursor Block Implementation ✅

- [x] Create Player/Cursor class
- [x] Render cursor block with distinct styling
- [x] Position cursor on character grid
- [x] Implement z-index layering (cursor above map blocks)

#### 10.2 Basic Movement (hjkl) ✅

- [x] Set up keyboard event listeners
- [x] Implement `h` (left) movement
  - Update player position
  - Validate movement (grid boundaries, obstacles)
  - Re-render cursor position
- [x] Implement `j` (down) movement
- [x] Implement `k` (up) movement
- [x] Implement `l` (right) movement
- [x] Add movement validation
  - Prevent out-of-bounds movement
  - Collision detection with blocks (for future obstacles)
- [x] Implement smooth cursor transitions
  - CSS transitions for movement
  - Duration based on distance traveled

#### 10.3 Unit Tests for Player Movement ✅

- [x] Test player position updates for each direction (h, j, k, l)
- [x] Test boundary collision detection (prevent out-of-bounds)
- [x] Test movement validation with obstacles
- [x] Test player initialization at correct starting position

### 11. Collectibles & Scoring ✅

#### 11.1 Coin System ✅

- [x] Create Coin class/data structure
- [x] Implement coin placement in map generation
  - Place at word boundaries initially
  - Random distribution with strategic placement
- [x] Render coins as DOM elements
- [x] Implement collection detection
  - Check cursor position vs coin positions each frame
  - Remove collected coins from map
  - Trigger collection event

#### 11.2 Basic Scoring ✅

- [x] Create Score class/module
- [x] Implement point awarding on coin collection
  - Base points per coin (10pts)
- [x] Track total coins collected
- [x] Track remaining coins (for win condition)

#### 11.3 Unit Tests for Coins & Scoring ✅

- [x] Test coin collection detection (position overlap)
- [x] Test score increments correctly on collection
- [x] Test coin removal from map after collection
- [x] Test tracking of remaining coins
- [x] Test win condition (all coins collected)

### 12. Timer System ✅

- [x] Create Timer class
- [x] Implement countdown from 60 seconds
- [x] Pause timer functionality
- [x] Timer completion callback (lose condition)
- [x] Format time display (MM:SS)

#### 12.1 Unit Tests for Timer ✅

- [x] Test timer countdown accuracy
- [x] Test pause/resume functionality
- [x] Test timer completion triggers callback
- [x] Test time formatting (MM:SS display)

### 13. User Interface (HUD) ✅

#### 13.1 Basic HUD Elements ✅

- [x] Create HUD container (fixed position overlay)
- [x] Implement score display (top-right)
  - Current score
  - Update on score change
- [x] Implement timer display (top-center)
  - Countdown display
  - Color coding (green → yellow → red as time decreases)
- [x] Add basic styling for HUD elements
  - Modern, clean design
  - High contrast for readability

#### 13.2 Mode Indicator ✅

- [x] Create mode indicator element (bottom-left)
- [x] Display "NORMAL" mode (Phase 1 only has Normal mode)
- [x] Style with distinct color

### 14. Game Loop & State Management ✅

#### 14.1 Game Loop ✅

- [x] Implement requestAnimationFrame-based game loop
- [x] Create update() function
  - Update timer
  - Check win/lose conditions
  - Handle collision detection
- [x] Create render() function
  - Update DOM based on game state
  - Re-render only changed elements (performance)
- [x] Implement frame rate monitoring (for debugging)

#### 14.2 State Management ✅

- [x] Create GameState class/store
- [x] Implement state transitions
  - MENU → PLAYING
  - PLAYING → LEVEL_COMPLETE
  - PLAYING → LEVEL_FAILED
- [x] Handle state-specific rendering
- [x] Implement state persistence (for pause/resume)

#### 14.3 Unit Tests for State Management ✅

- [x] Test state transitions (MENU → PLAYING → COMPLETE/FAILED)
- [x] Test invalid state transitions are prevented
- [x] Test state persistence on pause/resume
- [x] Test game state initialization

### 15. Win/Lose Conditions ✅

#### 15.1 Win Condition ✅

- [x] Detect when all coins collected
- [x] Trigger level complete state
- [x] Display "Level Complete" message (callback to screen)
- [x] Show final score
- [ ] Add "Restart" button/option (Group 7)

#### 15.2 Lose Condition ✅

- [x] Detect when timer reaches zero
- [x] Trigger level failed state
- [x] Display "Time's Up" message (callback to screen)
- [x] Show final score (coins collected)
- [ ] Add "Retry" button/option (Group 7)

#### 15.3 Unit Tests for Win/Lose Conditions ✅

- [x] Test win condition triggers when all coins collected
- [x] Test lose condition triggers when timer reaches zero
- [x] Test correct final score calculation
- [x] Test state transitions to LEVEL_COMPLETE and LEVEL_FAILED

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
