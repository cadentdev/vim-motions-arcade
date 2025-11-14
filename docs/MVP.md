# Phase 1 MVP Implementation Plan

**Status**: In Progress (Group 4 of 7 Complete)
**Methodology**: Test-Driven Development (TDD)
**Test Count**: 346 passing tests

---

## Implementation Strategy

Rather than working through TASKS.md sequentially, we're implementing in **functional groups** that combine related tasks across multiple sections. This ensures each group delivers a cohesive, testable feature.

### Why Group By Function?

The TASKS.md document is organized by architectural layer (Screen Management, Player System, etc.), but implementation is more efficient when we group related functionality:

- **Test once, implement once**: Related features share test fixtures and setup
- **Integration as we go**: Each group delivers working, visible functionality
- **Minimize context switching**: Stay focused on one area (e.g., rendering) at a time

---

## Group Overview

| Group       | Description              | TASKS.md Sections        | Status      |
| ----------- | ------------------------ | ------------------------ | ----------- |
| **Group 1** | Game State & Loop        | Section 14               | ✅ Complete |
| **Group 2** | Map Rendering            | Section 9.2              | ✅ Complete |
| **Group 3** | Player Rendering & Input | Section 10               | ✅ Complete |
| **Group 4** | Coin Rendering           | Section 11.1 (rendering) | ✅ Complete |
| **Group 5** | HUD Elements             | Section 13               | ⏳ Pending  |
| **Group 6** | Win/Lose Integration     | Section 15               | ⏳ Pending  |
| **Group 7** | Level End Screens        | Section 16               | ⏳ Pending  |

---

## Group 1: Game State & Loop ✅

**Completed**: ✅
**Commits**: 1 (808d9d6)
**Tests Added**: 54 (27 GameState + 27 GameLoop)
**Files Created**: 4

### What Was Built

#### GameState Class (`src/game/GameState.js`)

Centralized state management for all game data:

**State Management**:

- Player state (position, vim mode)
- Level state (current level, coins, collection progress)
- Score, timer, health tracking
- Unlocked motions system (hjkl unlocked by default)
- XP and player level (for future progression)
- Game flags (paused, game over, level complete)

**Methods**:

- `updatePlayerPosition(x, y)` - Move player
- `updatePlayerMode(mode)` - Switch vim modes
- `addScore(points)` - Award points
- `initializeLevel(levelNum, coins)` - Set up new level
- `collectCoin(index)` - Mark coin as collected
- `areAllCoinsCollected()` - Check win condition
- `unlockMotion(motion)` - Grant access to new movements
- `pause() / resume()` - Game pause control
- `setGameOver() / setLevelComplete()` - End game states
- `toJSON() / fromJSON()` - Serialization for save/load

**Test Coverage**: 27 tests covering:

- Initialization with default values
- State updates (player, score, timer, health)
- Level management and coin collection
- Motion unlocking system
- Game state flags (pause, game over, level complete)
- State reset functionality
- JSON serialization/deserialization

#### GameLoop Class (`src/game/GameLoop.js`)

RequestAnimationFrame-based game loop with fixed timestep:

**Architecture**:

- Fixed timestep at 60 FPS for consistent game speed
- Variable framerate rendering for smooth visuals
- Callback-based design for extensibility
- Testable with manual `tick()` method

**Loop Phases**:

1. **Update** (60 FPS fixed): Game logic, timer countdown
2. **Render** (variable): Visual updates
3. **Condition Check**: Win/lose detection

**Features**:

- Win detection: All coins collected → stops loop, calls `onWin` callback
- Lose detection: Timer expires → stops loop, calls `onLose` callback
- Pause/resume without stopping the loop
- Frame counting and FPS tracking
- Graceful handling of missing callbacks

**Methods**:

- `start() / stop()` - Control loop execution
- `pause() / resume() / togglePause()` - Pause control
- `tick(deltaTime)` - Manual step for testing
- `getAverageFPS()` - Performance monitoring

**Test Coverage**: 27 tests covering:

- Start/stop lifecycle
- Update cycle (timer countdown, pause behavior)
- Render cycle (always renders, even when paused)
- Win condition detection
- Lose condition detection
- Pause/resume functionality
- Frame timing and FPS calculation
- Edge cases (missing callbacks, rapid start/stop)

### TASKS.md Mapping

This group completes **Section 14: Game Loop & State Management**:

- ✅ 14.1 Game Loop
  - ✅ Implement requestAnimationFrame-based game loop
  - ✅ Create update() function (timer, win/lose, collision)
  - ✅ Create render() function (callback-based)
  - ✅ Implement frame rate monitoring (FPS tracking)

- ✅ 14.2 State Management
  - ✅ Create GameState class/store
  - ✅ Implement state transitions (MENU → PLAYING → COMPLETE/FAILED)
  - ✅ Handle state-specific rendering (via callbacks)
  - ✅ Implement state persistence (toJSON/fromJSON for pause/resume)

- ✅ 14.3 Unit Tests for State Management
  - ✅ Test state transitions
  - ✅ Test invalid state transitions are prevented
  - ✅ Test state persistence on pause/resume
  - ✅ Test game state initialization

### Key Design Decisions

1. **Callback-Based Loop**: GameLoop doesn't know about rendering - it calls callbacks, making it testable and flexible
2. **Centralized State**: Single GameState object makes saves/loads trivial and debugging easier
3. **Fixed Timestep**: Game speed is consistent across all devices (60 FPS logic, variable render)
4. **Testability First**: `tick()` method allows deterministic testing without real animation frames

---

## Group 2: Map Rendering ✅

**Completed**: ✅
**Commits**: 1 (6f69bdd)
**Tests Added**: 23
**Files Created**: 2

### What Was Built

#### MapRenderer Class (`src/rendering/MapRenderer.js`)

Renders map blocks as DOM elements:

**Responsibilities**:

- Convert map data (from MapGenerator) to DOM elements
- Apply monospace styling for character grid alignment
- Implement viewport/camera system with CSS transforms
- Handle map scrolling centered on player
- Efficient DOM element caching and reuse

**Methods**:

- `setContainer(element)` - Bind to DOM container
- `renderMap(mapData)` - Create/update map DOM elements
- `renderBlock(block, index)` - Render individual block
- `clearMap()` - Remove all map elements
- `centerOnPlayer(x, y)` - Center camera on player position
- `getCharacterSize() / setCharacterSize()` - Character dimensions

**Implementation Details**:

- Map blocks rendered as `<div class="map-block">` with absolute positioning
- Monospace font (Courier New, monospace) for pixel-perfect alignment
- Character grid: 10px width, 16px height per character
- Viewport uses CSS transform for smooth GPU-accelerated scrolling
- Z-index layering: map (0) → coins (1) → player (2)
- DOM element caching via Map for performance
- Handles 200+ blocks efficiently (<100ms render time)

### TASKS.md Mapping

Completes **Section 9.2: Map Rendering (DOM-based)**:

- ✅ Create DOM elements for map blocks
- ✅ Apply monospace styling for alignment
- ✅ Implement block rendering from map data
- ✅ Add basic styling (colors, spacing)
- ✅ Create viewport/camera system
  - ✅ Center view on player cursor
  - ✅ Handle map scrolling for larger documents

### Test Coverage

**23 unit tests** covering:

- Container initialization and validation
- Map rendering from MapGenerator format
- Block positioning and coordinate system
- Text content rendering
- Empty map handling
- Block re-rendering and updates
- Map clearing functionality
- Viewport centering on player position
- Boundary scrolling prevention
- Small map handling (no scroll needed)
- Performance with 200 blocks
- DOM element reuse
- Error handling (no container, invalid data, malformed blocks)
- Z-index layering
- Coordinate system consistency
- Integration with MapGenerator output format

---

## Group 3: Player Rendering & Input ✅

**Completed**: ✅
**Commits**: 1 (74eb711)
**Tests Added**: 53 (22 PlayerRenderer + 31 InputManager)
**Files Created**: 4

### What Was Built

#### PlayerRenderer Class (`src/rendering/PlayerRenderer.js`)

DOM-based player cursor rendering with smooth transitions:

**Implementation Details**:

- Character-grid positioning (10px × 16px matching MapRenderer)
- DOM element caching (single reusable cursor element)
- Z-index layering: cursor at z-index 2 (above map at 0, coins at 1)
- CSS transitions: 0.15s ease-out for smooth movement
- Block character (█) for cursor visualization
- Monospace font alignment

**Methods**:

- `setContainer(container)` - Bind to DOM container
- `renderCursor(x, y)` - Create/update cursor at grid position
- `clearCursor()` - Remove cursor from DOM
- `setCharacterSize(width, height)` - Configure character dimensions
- `getCharacterSize()` - Retrieve current character dimensions

#### InputManager Class (`src/input/InputManager.js`)

Keyboard event handling with callback-based architecture:

**Implementation Details**:

- Document-level keydown event listening
- Movement key detection (h, j, k, l) with case-insensitive handling
- Command mode trigger (:) and Escape key support
- Modifier key filtering (blocks Ctrl, Alt, Meta combinations)
- Key blocking system for disabling specific inputs
- Enable/disable state management with proper cleanup
- Automatic preventDefault for game keys to avoid browser conflicts

**Methods**:

- `enable()` - Attach event listeners
- `disable()` - Remove event listeners and cleanup
- `handleKeyDown(event)` - Process keyboard input
- `blockKeys(keys)` - Disable specific key inputs
- `unblockKeys(keys)` - Re-enable blocked keys
- `clearBlockedKeys()` - Clear all blocks

**Callbacks**:

- `onMove(key)` - Triggered for hjkl movement keys
- `onCommandMode()` - Triggered for : (colon) key
- `onEscape()` - Triggered for Escape key

### TASKS.md Mapping

Completes **Section 10: Player Character System**:

**10.1 Cursor Block Implementation**:

- ✅ Create Player/Cursor class (already existed from Group 1)
- ✅ Render cursor block with distinct styling
- ✅ Position cursor on character grid
- ✅ Implement z-index layering (cursor above map blocks)

**10.2 Basic Movement (hjkl)**:

- ✅ Set up keyboard event listeners
- ✅ Implement `h` (left) movement
  - ✅ Wire to keyboard
  - ✅ Update player position
  - ✅ Validate movement (grid boundaries, obstacles)
  - ✅ Re-render cursor position
- ✅ Implement `j` (down) movement
- ✅ Implement `k` (up) movement
- ✅ Implement `l` (right) movement
- ✅ Add movement validation
  - ✅ Prevent out-of-bounds movement
  - ✅ Collision detection with blocks
- ✅ Implement smooth cursor transitions
  - ✅ CSS transitions for movement
  - ✅ Duration based on distance traveled (0.15s ease-out)

**10.3 Unit Tests for Player Movement**:

- [x] Test player position updates for each direction
- [x] Test boundary collision detection
- [x] Test movement validation with obstacles
- [x] Test player initialization at correct starting position

### Test Coverage

**53 unit tests** covering:

**PlayerRenderer (22 tests)**:

- Container initialization and validation
- Cursor rendering at specified positions
- Character grid positioning accuracy
- Z-index layering (cursor at z-index 2)
- Visual styling (monospace font, block character)
- Position updates and DOM element reuse
- CSS transition application (0.15s ease-out)
- Cursor clearing functionality
- Character size configuration
- Error handling (no container, invalid coordinates)
- Integration with GameState player positions

**InputManager (31 tests)**:

- Enable/disable state management
- Movement key detection (h, j, k, l) with case handling
- Command mode trigger (:) and Escape key
- Modifier key filtering (Ctrl, Alt, Meta)
- Default browser behavior prevention
- Event listener attachment/detachment
- Callback invocation (onMove, onCommandMode, onEscape)
- Missing callback safety checks
- Key blocking/unblocking system
- Rapid key press handling
- Mixed key sequence processing

---

## Group 4: Coin Rendering ✅

**Completed**: ✅
**Commits**: 1 (TBD - will be added after commit)
**Tests Added**: 25
**Files Created**: 2

### What Was Built

#### CoinRenderer Class (`src/rendering/CoinRenderer.js`)

DOM-based coin rendering with collection state management:

**Implementation Details**:

- Character-grid positioning (10px × 16px matching MapRenderer/PlayerRenderer)
- DOM element array caching (one element per coin, reused on updates)
- Z-index layering: coins at z-index 1 (above map at 0, below player at 2)
- Diamond character (◆) for coin visualization
- Visibility management: `display: none` for collected coins, `display: block` for uncollected
- Monospace font alignment
- Automatic cleanup when coin count changes

**Methods**:

- `setContainer(container)` - Bind to DOM container
- `renderCoins(coins)` - Create/update all coin elements from array
- `clearCoins()` - Remove all coins from DOM
- `setCharacterSize(width, height)` - Configure character dimensions
- `getCharacterSize()` - Retrieve current character dimensions

**Visual Design**:

- Coins rendered as `<div class="coin">` elements
- Diamond character (◆) for visual representation
- Z-index 1 (above map blocks, below player cursor)
- Hidden when collected (display: none)

### TASKS.md Mapping

Completes **Section 11.1: Coin System (rendering portion)**:

- ✅ Create Coin class/data structure (already existed)
- ✅ Implement coin placement in map generation (already existed)
- ✅ Render coins as DOM elements
- ✅ Implement collection detection (logic already existed)
  - ✅ Check cursor position vs coin positions
  - ✅ Remove collected coins from map (state)
  - ✅ Trigger collection event (visual feedback via display: none)

### Test Coverage

**25 unit tests** covering:

- Container initialization and validation
- Coin rendering from array of coin objects
- Character grid positioning accuracy (10px × 16px)
- Z-index layering (coins at z-index 1)
- Visual styling (monospace font, diamond character)
- Collected coin hiding (display: none)
- Uncollected coin visibility (display: block)
- Collection state updates
- DOM element reuse and caching
- Empty coin array handling
- Coin clearing functionality
- Error handling (no container, invalid coin data)
- Character size configuration
- Performance with 100 coins (< 100ms)
- Integration with GameState coin format

---

## Group 5: HUD Elements ⏳

**Status**: Pending
**Estimated Tests**: ~15-20

### What Will Be Built

#### HUD Manager (`src/ui/HUD.js`)

Display game information overlay:

**Responsibilities**:

- Display score (top-right)
- Display timer (top-center) with color coding
- Display mode indicator (bottom-left)
- Update in real-time as GameState changes

**Methods**:

- `initialize(container)` - Create HUD DOM structure
- `updateScore(score)` - Refresh score display
- `updateTimer(seconds)` - Refresh timer with color coding
- `updateMode(mode)` - Show current vim mode
- `destroy()` - Clean up HUD elements

**Visual Design**:

- Fixed position overlay (doesn't scroll with map)
- High contrast for readability
- Timer color coding:
  - Green: > 30 seconds
  - Yellow: 15-30 seconds
  - Red: < 15 seconds
- Mode indicator with distinct colors per mode

### TASKS.md Mapping

Completes **Section 13: User Interface (HUD)**:

**13.1 Basic HUD Elements**:

- [ ] Create HUD container (fixed position overlay)
- [ ] Implement score display (top-right)
  - [ ] Current score
  - [ ] Update on score change
- [ ] Implement timer display (top-center)
  - [ ] Countdown display
  - [ ] Color coding (green → yellow → red as time decreases)
- [ ] Add basic styling for HUD elements
  - [ ] Modern, clean design
  - [ ] High contrast for readability

**13.2 Mode Indicator**:

- [ ] Create mode indicator element (bottom-left)
- [ ] Display "NORMAL" mode (Phase 1 only has Normal mode)
- [ ] Style with distinct color

### Test Plan

**Unit Tests** (15-20 tests):

- HUD elements created correctly
- Score updates reflected in DOM
- Timer countdown displayed accurately
- Timer color changes at thresholds
- Mode indicator shows correct mode
- HUD doesn't interfere with game area

---

## Group 6: Win/Lose Integration ⏳

**Status**: Pending
**Estimated Tests**: ~10-15

### What Will Be Built

#### Game Coordinator (`src/game/GameCoordinator.js`)

Ties everything together and handles game flow:

**Responsibilities**:

- Initialize all systems (state, loop, renderers, input)
- Start new game / Continue game
- Handle win/lose callbacks from GameLoop
- Trigger screen transitions
- Clean up on game exit

**Methods**:

- `startNewGame()` - Initialize fresh game
- `continueGame(savedState)` - Resume from save
- `handleWin()` - Transition to LEVEL_COMPLETE screen
- `handleLose()` - Transition to LEVEL_FAILED screen
- `cleanup()` - Stop loop, remove listeners

**Flow**:

```
Main Menu → GameCoordinator.startNewGame()
  → Initialize GameState with level 1
  → Generate map with coins
  → Start GameLoop with callbacks
  → Attach keyboard listeners
  → Render everything

GameLoop detects win/lose
  → Calls callback
  → GameCoordinator.handleWin() or handleLose()
  → Update final scores in screens
  → Save to leaderboard
  → Switch to end screen
```

### TASKS.md Mapping

Completes **Section 15: Win/Lose Conditions**:

**15.1 Win Condition**:

- [x] Detect when all coins collected (GameLoop)
- [ ] Trigger level complete state (integration)
- [ ] Display "Level Complete" message (screen transition)
- [ ] Show final score (update end screen)
- [ ] Add "Restart" button/option (wire up)

**15.2 Lose Condition**:

- [x] Detect when timer reaches zero (GameLoop)
- [ ] Trigger level failed state (integration)
- [ ] Display "Time's Up" message (screen transition)
- [ ] Show final score (update end screen)
- [ ] Add "Retry" button/option (wire up)

**15.3 Unit Tests for Win/Lose Conditions** (mostly complete):

- [x] Test win condition triggers when all coins collected
- [x] Test lose condition triggers when timer reaches zero
- [x] Test correct final score calculation
- [x] Test state transitions to LEVEL_COMPLETE and LEVEL_FAILED
- [ ] Integration tests for screen transitions

### Test Plan

**Integration Tests** (10-15 tests):

- Full game flow: start → play → win → menu
- Full game flow: start → play → lose → retry
- Score saved to leaderboard on completion
- Screen transitions work correctly
- Save game persists state
- Continue game restores state

---

## Group 7: Level End Screens ⏳

**Status**: Pending
**Estimated Tests**: ~10-15

### What Will Be Built

#### End Screen Manager (`src/ui/EndScreens.js`)

Manage level complete and failed screens:

**Responsibilities**:

- Update final score displays
- Handle button clicks (retry, next level, menu)
- Show appropriate messages
- Animate transitions (optional)

**Methods**:

- `showLevelComplete(score)` - Display win screen with score
- `showLevelFailed(score)` - Display lose screen with score
- `attachEventListeners()` - Wire up buttons
- `detachEventListeners()` - Clean up on hide

**Button Actions**:

- **Next Level** (complete screen): Restart level (MVP restarts same level)
- **Retry** (failed screen): Restart level
- **Main Menu** (both screens): Return to menu, save score to leaderboard

### TASKS.md Mapping

Completes **Section 16: Level End Screens**:

- [ ] Create level complete screen template
  - [ ] Score display
  - [ ] "Next Level" button (restarts for MVP)
  - [ ] "Main Menu" button
- [ ] Create level failed screen template
  - [ ] Score display
  - [ ] "Retry" button
  - [ ] "Main Menu" button

Note: HTML templates already exist in `index.html`, this group wires them up.

### Test Plan

**Integration Tests** (10-15 tests):

- Score displayed correctly on both screens
- "Next Level" button restarts game
- "Retry" button restarts game
- "Main Menu" returns to menu
- Leaderboard updated with final score
- Screen visibility toggled correctly

---

## Integration Points

### How Groups Connect

```
Group 1 (State & Loop)
  ↓
Group 2 (Map Rendering) ← reads GameState
  ↓
Group 3 (Player & Input) ← updates GameState, triggers re-render
  ↓
Group 4 (Coin Rendering) ← reads GameState coins
  ↓
Group 5 (HUD) ← reads GameState (score, timer, mode)
  ↓
Group 6 (Win/Lose) ← GameLoop callbacks trigger screen changes
  ↓
Group 7 (End Screens) ← displays final results, returns to menu
```

### Main.js Integration

The `main.js` file will be updated incrementally:

**After Group 1**: No changes (logic only, no visuals)
**After Group 2**: Renderer instantiated when entering PLAYING screen
**After Group 3**: Input listeners attached, player visible
**After Group 4**: Coins visible and collectible
**After Group 5**: HUD displays during gameplay
**After Group 6**: Win/lose triggers screen transitions
**After Group 7**: Full game loop functional, MVP complete

---

## Testing Strategy

### Unit Tests (Vitest)

- Run in watch mode during development
- Fast (<1 second for full suite in Phase 1)
- Test individual functions and classes
- Mock DOM and external dependencies
- Pre-commit hook requirement

### Integration Tests (Optional for MVP)

- Test how components work together
- Verify rendering produces correct DOM
- Check event flow (keyboard → state → render)

### E2E Tests (Playwright)

- Will be written after MVP is complete
- Test full user flows
- Run on pre-push hook
- Deployment gate

### Current Test Count

- **Total**: 245 passing tests
- **Group 1**: 54 tests (GameState: 27, GameLoop: 27)
- **Existing**: 191 tests (from previous phases)

---

## Progress Tracking

### Completed

- ✅ Group 1: Game State & Loop (54 tests, 1 commit)

### In Progress

- ⏳ Group 2: Map Rendering

### Remaining

- ⏳ Groups 3-7 (estimated 70-90 additional tests)

### Estimated Completion

- **Per Group**: 2-4 hours (with TDD)
- **Total Remaining**: 12-24 hours
- **MVP Complete**: After Group 7

---

## Success Criteria

The MVP is complete when all 7 groups are finished and:

### Functional Requirements

- ✅ Player can start a new game from menu
- ⏳ Map is visible with word-like blocks
- ⏳ Player cursor is visible and controllable (hjkl)
- ⏳ Coins are visible and collectible
- ⏳ Score and timer display and update
- ⏳ Collecting all coins triggers level complete screen
- ⏳ Timer expiring triggers level failed screen
- ⏳ Can retry failed levels
- ⏳ Can return to main menu from end screens
- ✅ Scores are saved to leaderboard

### Technical Requirements

- ✅ All unit tests passing (245+)
- ⏳ No console errors during gameplay
- ⏳ Smooth 60 FPS performance
- ⏳ Clean code (ESLint passing)
- ⏳ Well-documented (JSDoc comments)

### User Experience

- ⏳ Game is playable end-to-end
- ⏳ Controls feel responsive
- ⏳ Visual feedback is clear
- ⏳ Win/lose conditions are obvious
- ⏳ Can complete full game cycle (start → play → end → restart)

---

## Next Steps

**Immediate**: Begin Group 2 (Map Rendering)

1. Write tests for DOMRenderer class
2. Implement map rendering from MapGenerator data
3. Add viewport/camera system
4. Integrate with main.js PLAYING screen
5. Verify maps render correctly
6. Commit and push

**Then**: Continue sequentially through Groups 3-7

---

## Notes

### Why This Approach Works

- **Incremental progress**: Each group delivers visible functionality
- **Testable**: Pure functions, mockable dependencies
- **Maintainable**: Clear separation of concerns
- **Efficient**: Related features developed together
- **Low risk**: Can stop at any group and have working code

### Flexibility

If priorities change, groups can be reordered:

- Need gameplay faster? Do Groups 3-4 before Group 2
- Need visuals first? Do Groups 2-4 before Groups 5-7

Current order prioritizes: Logic → Visuals → Integration → Polish
