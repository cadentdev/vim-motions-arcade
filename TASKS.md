# Vim Motions Arcade - Development Tasks

This document outlines the initial development tasks for building the Vim Motions Arcade game, based on the PRD specifications. These tasks focus on establishing the foundation and delivering Phase 1: Core Prototype (MVP).

---

## Phase 0: Project Setup & Architecture

### 1. Project Initialization
- [ ] Initialize project structure (src, assets, tests directories)
- [ ] Set up build tooling (Vite/Webpack/Parcel)
- [ ] Configure TypeScript with strict type checking
- [ ] Set up linting (ESLint) and formatting (Prettier)
- [ ] Create package.json with necessary dependencies
- [ ] Set up Git hooks for code quality (husky + lint-staged)

### 2. Development Environment
- [ ] Configure hot module replacement for rapid iteration
- [ ] Set up basic HTML template with game container
- [ ] Create development server configuration
- [ ] Add source maps for debugging

### 3. Core Architecture Planning
- [ ] Define core game state interface
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

### 4. Map Generation System

#### 4.1 Basic Map Structure
- [ ] Create Map class/module
- [ ] Implement simple grid system (character-based coordinates)
- [ ] Define block/word data structure
  - Position, width, type (word/obstacle)
- [ ] Generate static test map for initial development
- [ ] Implement basic procedural generation
  - Random block placement with spacing
  - Ensure document-like structure (words separated by spaces)
  - Add blank lines (for future paragraph navigation)

#### 4.2 Map Rendering (DOM-based)
- [ ] Create DOM elements for map blocks
- [ ] Apply monospace styling for alignment
- [ ] Implement block rendering from map data
- [ ] Add basic styling (colors, spacing)
- [ ] Create viewport/camera system
  - Center view on player cursor
  - Handle map scrolling for larger documents

### 5. Player Character System

#### 5.1 Cursor Block Implementation
- [ ] Create Player/Cursor class
- [ ] Render cursor block with distinct styling
- [ ] Position cursor on character grid
- [ ] Implement z-index layering (cursor above map blocks)

#### 5.2 Basic Movement (hjkl)
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

### 6. Collectibles & Scoring

#### 6.1 Coin System
- [ ] Create Coin class/data structure
- [ ] Implement coin placement in map generation
  - Place at word boundaries initially
  - Random distribution with strategic placement
- [ ] Render coins as DOM elements
- [ ] Implement collection detection
  - Check cursor position vs coin positions each frame
  - Remove collected coins from map
  - Trigger collection event

#### 6.2 Basic Scoring
- [ ] Create Score class/module
- [ ] Implement point awarding on coin collection
  - Base points per coin (10pts)
- [ ] Track total coins collected
- [ ] Track remaining coins (for win condition)

### 7. Timer System
- [ ] Create Timer class
- [ ] Implement countdown from 60 seconds
- [ ] Pause timer functionality
- [ ] Timer completion callback (lose condition)
- [ ] Format time display (MM:SS)

### 8. User Interface (HUD)

#### 8.1 Basic HUD Elements
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

#### 8.2 Mode Indicator
- [ ] Create mode indicator element (bottom-left)
- [ ] Display "NORMAL" mode (Phase 1 only has Normal mode)
- [ ] Style with distinct color

### 9. Game Loop & State Management

#### 9.1 Game Loop
- [ ] Implement requestAnimationFrame-based game loop
- [ ] Create update() function
  - Update timer
  - Check win/lose conditions
  - Handle collision detection
- [ ] Create render() function
  - Update DOM based on game state
  - Re-render only changed elements (performance)
- [ ] Implement frame rate monitoring (for debugging)

#### 9.2 State Management
- [ ] Create GameState class/store
- [ ] Implement state transitions
  - MENU → PLAYING
  - PLAYING → LEVEL_COMPLETE
  - PLAYING → LEVEL_FAILED
- [ ] Handle state-specific rendering
- [ ] Implement state persistence (for pause/resume)

### 10. Win/Lose Conditions

#### 10.1 Win Condition
- [ ] Detect when all coins collected
- [ ] Trigger level complete state
- [ ] Display "Level Complete" message
- [ ] Show final score
- [ ] Add "Restart" button/option

#### 10.2 Lose Condition
- [ ] Detect when timer reaches zero
- [ ] Trigger level failed state
- [ ] Display "Time's Up" message
- [ ] Show final score (coins collected)
- [ ] Add "Retry" button/option

### 11. Basic Menus

#### 11.1 Main Menu
- [ ] Create simple main menu screen
- [ ] Add "Start Game" button
- [ ] Add "Quit" option (closes tab/returns to URL)
- [ ] Style menu with theme consistent with game

#### 11.2 Level End Screens
- [ ] Create level complete screen template
  - Score display
  - "Next Level" button (restarts for MVP)
  - "Main Menu" button
- [ ] Create level failed screen template
  - Score display
  - "Retry" button
  - "Main Menu" button

### 12. Command Mode (Basic)
- [ ] Detect `:` key press to enter command mode
- [ ] Create command input overlay
- [ ] Implement basic commands
  - `:quit` - Return to main menu
  - `:restart` - Restart current level
- [ ] Handle Esc to exit command mode
- [ ] Parse and execute commands

---

## Phase 1: Testing & Polish

### 13. Playtesting & Iteration
- [ ] Playtest core loop for fun factor
- [ ] Adjust timing (movement speed, timer duration)
- [ ] Tune difficulty (map size, coin placement)
- [ ] Verify controls feel responsive
- [ ] Test on different screen sizes

### 14. Bug Fixes & Edge Cases
- [ ] Test boundary conditions (map edges)
- [ ] Handle rapid key presses
- [ ] Test pause/resume functionality
- [ ] Verify state transitions work correctly
- [ ] Test with different keyboard layouts

### 15. Code Quality
- [ ] Add JSDoc comments to core functions/classes
- [ ] Refactor duplicated code
- [ ] Ensure consistent naming conventions
- [ ] Run linter and fix issues
- [ ] Basic performance profiling

### 16. Documentation
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
- **Framework**: Vanilla TypeScript initially (can migrate to React/Svelte later if needed)
- **Rendering**: DOM-based for MVP (evaluate Canvas in Phase 3)
- **Styling**: CSS with CSS variables for theming support
- **State**: Simple class-based state (can migrate to Redux/Zustand later)

### Development Principles
1. **Iterative Development**: Build, playtest, refine
2. **Fun First**: Prioritize gameplay feel over features
3. **Clean Code**: Maintain readability for future features
4. **Performance Aware**: Profile early, optimize as needed
5. **Modular Design**: Easy to extend with Phase 2+ features

### Open Questions for Phase 1
- Map size: How many characters wide/tall? (Start 40x20, adjust)
- Movement speed: Instant or animated? (CSS transitions ~100-200ms)
- Coin density: How many coins per map? (Start with 20-30)
- Timer: 60 seconds sufficient? (Start 60s, adjust based on playtesting)

---

**Status**: Ready to begin development
**Priority**: Complete Phase 0 and Phase 1 tasks in order
**Estimated Timeline**: 2-3 weeks for Phase 1 MVP
