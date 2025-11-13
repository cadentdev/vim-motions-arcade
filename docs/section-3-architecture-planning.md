# Section 3: Core Architecture Planning - Results

**Phase 0, Section 3 Completion Report**
**Date:** November 13, 2025
**Status:** ✅ All 4 Tasks Complete

---

## Overview

This document summarizes the completed architecture planning for the Vim Motions Arcade game. All planning decisions have been documented in `ARCHITECTURE.md` with full implementation details.

---

## Task 1: Core Game State Structure ✅

**Status:** Complete and documented

### Game State Schema

A centralized state object containing all game data:

```javascript
{
  // Player/Cursor State
  player: {
    x: 0,                 // Grid X coordinate
    y: 0,                 // Grid Y coordinate
    mode: 'normal',       // Vim mode: normal, insert, visual, command
  },

  // Level State
  level: {
    current: 1,           // Current level number
    coins: [],            // Array of coin objects {x, y, collected}
    totalCoins: 0,        // Total coins in level
    collectedCoins: 0,    // Coins collected this run
  },

  // Progression & Scoring
  score: 0,               // Total score
  timer: 60,              // Time remaining (seconds)
  health: 3,              // Player health (Phase 4+)
  xp: 0,                  // Experience points (Phase 5+)
  playerLevel: 1,         // Player progression level (Phase 5+)

  // Unlocked Abilities
  unlockedMotions: {
    h: true,              // Left (unlocked from start)
    j: true,              // Down
    k: true,              // Up
    l: true,              // Right
    w: false,             // Word forward (Phase 2+)
    b: false,             // Word backward (Phase 2+)
    e: false,             // End of word (Phase 2+)
    // ... more motions unlocked through gameplay
  },

  // Game State Flags
  isPaused: false,
  isGameOver: false,
  isLevelComplete: false,
}
```

### Key Design Decisions

1. **Centralized State:** Single source of truth for all game data
2. **Flat Structure:** Easy to serialize for localStorage saves
3. **Extensibility:** Ready for Phase 2+ features without breaking changes
4. **Clear Separation:** Player, level, progression, and flags separated logically

### Benefits

- ✅ Easy to save/load (simple JSON serialization)
- ✅ Clear data flow throughout application
- ✅ Testable (can mock entire state)
- ✅ Debug-friendly (inspect entire state at once)

---

## Task 2: Rendering Strategy Design ✅

**Status:** Complete with migration path planned

### Phase 1: DOM-Based Rendering (Current)

**Decision:** Start with DOM elements for initial MVP

**Implementation Approach:**

- Map blocks as `<div>` elements with absolute positioning
- Monospace font (Courier New) for character grid alignment
- Player cursor as styled `<div>` with higher z-index
- CSS Grid or Flexbox for layout
- CSS transitions for smooth movement animations

**Rationale:**

- ✅ Faster initial development
- ✅ Easier to debug (inspect elements in DevTools)
- ✅ Simpler state → view updates
- ✅ Good performance for MVP scope
- ✅ Familiar to most developers

**Example Structure:**

```html
<div id="game-area">
  <div class="map-block" style="left: 0; top: 0;">word</div>
  <div class="map-block" style="left: 60px; top: 0;">another</div>
  <div class="player-cursor" style="left: 0; top: 0;"></div>
</div>
```

### Phase 3+: Canvas Migration Path (Future)

**When to migrate:**

- Performance bottlenecks with many DOM elements (100+ blocks)
- Complex visual effects (particles, trails)
- Advanced rendering needs (lighting, shaders)

**Migration Strategy:**

- Keep rendering logic separate from game logic
- Use Renderer interface pattern:

  ```javascript
  class Renderer {
    renderMap(mapData) {
      /* ... */
    }
    renderPlayer(playerData) {
      /* ... */
    }
    renderUI(uiData) {
      /* ... */
    }
  }

  // Easy to swap implementations:
  const renderer = new DOMRenderer();
  // or
  const renderer = new CanvasRenderer();
  ```

**Code Structure for Easy Migration:**

```javascript
// src/rendering/DOMRenderer.js
export class DOMRenderer {
  renderMap(mapData) {
    // DOM-based implementation
  }
}

// src/rendering/CanvasRenderer.js (Phase 3+)
export class CanvasRenderer {
  renderMap(mapData) {
    // Canvas-based implementation
  }
}

// Game code doesn't care which renderer is used:
gameLoop.setRenderer(new DOMRenderer());
```

### Benefits

- ✅ Start simple, migrate when needed
- ✅ No premature optimization
- ✅ Clear separation of concerns
- ✅ Future-proof architecture

---

## Task 3: Input Handling System Plan ✅

**Status:** Complete system architecture designed

### Architecture Overview

```
Keyboard Event → InputManager → Mode Handler → Game State Update → Render
```

### Components

#### 1. InputManager (Central Hub)

**Responsibilities:**

- Capture all keyboard events
- Determine current Vim mode
- Delegate to appropriate mode handler
- Maintain input buffer for combos

**Example Implementation:**

```javascript
class InputManager {
  constructor(gameState) {
    this.gameState = gameState;
    this.buffer = [];
    this.modeHandlers = {
      normal: new NormalModeHandler(),
      insert: new InsertModeHandler(),
      visual: new VisualModeHandler(),
      command: new CommandModeHandler(),
    };
  }

  handleKeyPress(event) {
    const mode = this.gameState.player.mode;
    const handler = this.modeHandlers[mode];

    // Delegate to mode-specific handler
    handler.handleInput(event.key, this.gameState);
  }
}
```

#### 2. Mode Handlers (Strategy Pattern)

Each Vim mode has its own handler:

**NormalModeHandler:**

- Movement keys: `h`, `j`, `k`, `l` (Phase 1)
- Word motions: `w`, `b`, `e` (Phase 2)
- Line motions: `0`, `$`, `gg`, `G` (Phase 4)
- Combos: `5j`, `3w`, `gg` (Phase 2+)

**InsertModeHandler:**

- Limited input (mostly disabled in Phase 1)
- `Esc` to exit back to normal mode

**VisualModeHandler:**

- Selection and movement (Phase 4)
- Visual feedback for selected area

**CommandModeHandler:**

- Text input for commands
- Execute commands: `:q`, `:quit`, `:help`
- Command buffer management

#### 3. Input Buffer (Combo Detection)

**Purpose:** Enable Vim-style key combinations

**Examples:**

- `5j` → Move down 5 spaces
- `gg` → Go to top of document
- `3w` → Move forward 3 words

**Implementation Approach:**

```javascript
class InputBuffer {
  constructor() {
    this.buffer = '';
    this.timeout = null;
  }

  addKey(key) {
    this.buffer += key;
    this.resetTimeout();
    return this.tryExecuteCombo();
  }

  resetTimeout() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.buffer = ''; // Clear after 1 second
    }, 1000);
  }

  tryExecuteCombo() {
    // Check if buffer matches any known combo
    // Return { success: boolean, action: string }
  }
}
```

### Benefits

- ✅ Clean separation of mode logic
- ✅ Easy to add new modes
- ✅ Testable (mock keyboard events)
- ✅ Extensible combo system
- ✅ Authentic Vim feel

---

## Task 4: Game Loop Architecture Definition ✅

**Status:** Complete with detailed implementation plan

### Decision: requestAnimationFrame + Fixed Timestep

**Why this approach?**

- ✅ **Smooth animations:** Browser-optimized rendering
- ✅ **Consistent game speed:** Same speed on all devices
- ✅ **Frame-rate independent:** Game logic decoupled from render rate
- ✅ **Industry standard:** Used by most modern games

### Loop Structure

```javascript
class GameLoop {
  constructor(gameState, renderer) {
    this.gameState = gameState;
    this.renderer = renderer;
    this.lastTime = 0;
    this.accumulator = 0;
    this.fixedDelta = 1000 / 60; // 60 FPS fixed update rate
  }

  start() {
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  loop(currentTime) {
    // 1. Calculate time since last frame
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulator += deltaTime;

    // 2. Fixed update loop (game logic at 60 FPS)
    while (this.accumulator >= this.fixedDelta) {
      this.update(this.fixedDelta);
      this.accumulator -= this.fixedDelta;
    }

    // 3. Render (can run at variable framerate)
    this.render();

    // 4. Continue loop
    requestAnimationFrame((time) => this.loop(time));
  }

  update(delta) {
    // Update timer
    if (!this.gameState.isPaused) {
      this.gameState.timer -= delta / 1000;
    }

    // Check win/lose conditions
    this.checkGameConditions();

    // Update animations, particles, etc.
  }

  render() {
    this.renderer.renderAll(this.gameState);
  }

  checkGameConditions() {
    // Win condition: All coins collected
    if (
      this.gameState.level.collectedCoins === this.gameState.level.totalCoins
    ) {
      this.gameState.isLevelComplete = true;
    }

    // Lose condition: Timer expired
    if (this.gameState.timer <= 0) {
      this.gameState.isGameOver = true;
    }
  }
}
```

### Update vs Render Separation

**Update Cycle (Fixed):**

- Runs at exactly 60 times per second
- Updates game state, physics, logic
- Independent of screen refresh rate

**Render Cycle (Variable):**

- Runs as fast as possible (60 FPS, 120 FPS, 144 FPS, etc.)
- Only updates visual representation
- Smooth on high-refresh-rate displays

### Benefits

- ✅ Consistent gameplay across all devices
- ✅ Smooth visuals on high-refresh displays
- ✅ Easy to pause/resume (skip update cycle)
- ✅ Predictable performance
- ✅ Separates logic from presentation

---

## Additional Planning Completed

### Module Organization

Planned directory structure for Phase 1+:

```
src/
├── main.js                 # Entry point, initialization
├── game/
│   ├── GameState.js        # State management
│   ├── GameLoop.js         # Game loop logic
│   └── ScreenManager.js    # Screen transitions
├── input/
│   ├── InputManager.js     # Central input handling
│   └── modes/
│       ├── NormalMode.js
│       ├── CommandMode.js
│       ├── InsertMode.js
│       └── VisualMode.js
├── rendering/
│   ├── DOMRenderer.js      # DOM-based rendering
│   └── Camera.js           # Viewport/scrolling
├── entities/
│   ├── Player.js           # Player/cursor
│   ├── Coin.js             # Collectibles
│   └── MapBlock.js         # Map elements
├── map/
│   ├── MapGenerator.js     # Procedural generation
│   └── Level.js            # Level configuration
├── ui/
│   ├── HUD.js              # Heads-up display
│   ├── Menu.js             # Main menu
│   └── screens/
│       ├── LevelComplete.js
│       └── LevelFailed.js
├── storage/
│   ├── SaveManager.js      # Save/load game
│   └── Leaderboard.js      # Score tracking
└── utils/
    └── helpers.js          # Utility functions
```

### Design Patterns Selected

1. **Module Pattern:** ES modules for code organization
2. **Singleton Pattern:** GameState, InputManager (single instances)
3. **Strategy Pattern:** Mode handlers (interchangeable behaviors)
4. **Observer Pattern:** Event bus for decoupled communication (Phase 2+)
5. **State Pattern:** Screen management (different screen states)

### Performance Considerations

**Phase 1 (MVP):**

- Minimal DOM updates (only re-render changed elements)
- CSS transforms for movement (GPU-accelerated)
- Debounce/throttle expensive operations
- Profile with browser DevTools

**Future Optimization (Phase 3+):**

- Canvas migration if DOM becomes bottleneck
- Object pooling for particles
- Spatial hashing for collision detection
- Web Workers for heavy computations (if needed)

---

## Documentation

All architecture planning has been documented in detail:

### Primary Documentation

- **`ARCHITECTURE.md`** - Full 335-line architecture guide
  - All four tasks covered in detail
  - Code examples for every component
  - Migration strategies
  - Design pattern explanations
  - Performance considerations

### Supporting Documentation

- **`TASKS.md`** - Task tracker (Section 3 marked complete)
- **`docs/phase-0-completion-report.md`** - Phase 0 summary
- **This document** - Section 3 focused results

---

## Verification

All planning decisions have been:

- ✅ Documented with rationale
- ✅ Reviewed for feasibility
- ✅ Structured for testability
- ✅ Designed for extensibility
- ✅ Ready for implementation

---

## Next Steps

With architecture planning complete, Phase 1 implementation can begin:

1. **Implement core infrastructure** following architecture plan
2. **Start with TDD tests** (66 tests already written)
3. **Build SaveManager** → **Leaderboard** → **ScreenManager** → **CommandMode**
4. **Follow module organization** as defined
5. **Use design patterns** as specified
6. **Implement game loop** per architecture
7. **Build DOM renderer** as designed

---

## Success Criteria Met ✅

| Criterion                      | Status | Evidence                                           |
| ------------------------------ | ------ | -------------------------------------------------- |
| Game state structure defined   | ✅     | Documented in ARCHITECTURE.md with complete schema |
| Rendering strategy decided     | ✅     | DOM-first approach with Canvas migration path      |
| Input handling system planned  | ✅     | Architecture diagram and component breakdown       |
| Game loop architecture defined | ✅     | Implementation example with fixed timestep         |
| Module organization planned    | ✅     | Complete directory structure specified             |
| Design patterns selected       | ✅     | 5 patterns identified with use cases               |
| Documentation complete         | ✅     | 335-line ARCHITECTURE.md created                   |
| Ready for implementation       | ✅     | Clear plan with no ambiguities                     |

---

## Summary

**Section 3 (Core Architecture Planning) is 100% complete.** All four tasks have been thoroughly planned, documented, and verified. The architecture provides:

- **Clear structure** for game state
- **Flexible rendering** with migration path
- **Extensible input system** for Vim modes
- **Robust game loop** with fixed timestep
- **Modular organization** for scalability
- **Design patterns** for maintainability
- **Performance strategy** for optimization

The project is ready to move from planning to implementation with confidence.

---

**Report Generated:** November 13, 2025
**Section 3 Status:** ✅ Complete
**Documentation:** ARCHITECTURE.md
**Next Phase:** Phase 1 Implementation

---

_For full implementation details, refer to ARCHITECTURE.md_
