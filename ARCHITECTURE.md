# Vim Motions Arcade - Architecture Planning

This document outlines the core architecture decisions and design patterns for the Vim Motions Arcade game.

---

## Core Game State Structure

The game state will be a centralized object containing all game data:

```javascript
{
  // Player state
  player: {
    x: 0,              // X coordinate on grid
    y: 0,              // Y coordinate on grid
    mode: 'normal',    // Current vim mode (normal, insert, visual, command)
  },

  // Game progression state
  level: {
    current: 1,        // Current level number
    coins: [],         // Array of coin objects {x, y, collected}
    totalCoins: 0,     // Total coins in level
    collectedCoins: 0, // Coins collected this level
  },

  // Scoring & progression
  score: 0,            // Total score
  timer: 60,           // Time remaining in seconds
  health: 3,           // Player health (Phase 4+)

  // Unlocked abilities
  unlockedMotions: {
    h: true,           // Left
    j: true,           // Down
    k: true,           // Up
    l: true,           // Right
    w: false,          // Word forward (Phase 2+)
    b: false,          // Word backward (Phase 2+)
    // ... more motions
  },

  // XP & Leveling (Phase 5+)
  xp: 0,
  playerLevel: 1,

  // Game state flags
  isPaused: false,
  isGameOver: false,
  isLevelComplete: false,
}
```

---

## Rendering Strategy

### Phase 1: DOM-Based Rendering

- **Rationale**: Simpler to implement, easier to debug, faster initial development
- **Implementation**:
  - Map blocks rendered as `<div>` elements with absolute positioning
  - Monospace font (`Courier New`) for character grid alignment
  - Player cursor as a styled `<div>` with higher z-index
  - CSS Grid or flexbox for layout
  - CSS transitions for smooth movement

### Future: Canvas Migration (Phase 3+)

- Code will be structured to allow easy migration to Canvas
- Separate rendering logic from game logic
- Renderer interface pattern:
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
  ```

---

## Input Handling System

### Architecture

```
Keyboard Input → InputManager → ModeHandler → GameState Update → Render
```

### Components

**1. InputManager**

- Captures all keyboard events
- Delegates to appropriate mode handler
- Maintains input buffer for combo detection

**2. ModeHandlers**
Each Vim mode has its own handler:

- `NormalModeHandler`: Movement keys (hjkl, w, b, etc.)
- `InsertModeHandler`: Limited input (Esc to exit)
- `VisualModeHandler`: Selection and movement
- `CommandModeHandler`: Text input for commands (:q, :help, etc.)

**3. Input Buffer**

- Stores recent key presses for combo detection
- Example: `gg` (go to top), `5j` (move down 5 lines)
- Clears after timeout or successful combo execution

### Example Structure

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
    const currentMode = this.gameState.player.mode;
    const handler = this.modeHandlers[currentMode];
    handler.handleInput(event.key, this.gameState);
  }
}
```

---

## Game Loop Architecture

### Decision: requestAnimationFrame with Fixed Timestep

**Rationale**: Smooth animations, consistent game speed across devices

### Structure

```javascript
class GameLoop {
  constructor(gameState, renderer) {
    this.gameState = gameState;
    this.renderer = renderer;
    this.lastTime = 0;
    this.accumulator = 0;
    this.fixedDelta = 1000 / 60; // 60 FPS
  }

  start() {
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  loop(currentTime) {
    // Calculate delta time
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulator += deltaTime;

    // Fixed update loop (game logic)
    while (this.accumulator >= this.fixedDelta) {
      this.update(this.fixedDelta);
      this.accumulator -= this.fixedDelta;
    }

    // Render (can run at variable framerate)
    this.render();

    // Continue loop
    requestAnimationFrame((time) => this.loop(time));
  }

  update(delta) {
    // Update timer
    this.gameState.timer -= delta / 1000;

    // Check win/lose conditions
    this.checkGameConditions();

    // Update animations
    // Update particle effects (Phase 3+)
  }

  render() {
    this.renderer.renderAll(this.gameState);
  }

  checkGameConditions() {
    // Win: All coins collected
    if (
      this.gameState.level.collectedCoins === this.gameState.level.totalCoins
    ) {
      this.gameState.isLevelComplete = true;
    }

    // Lose: Timer expired
    if (this.gameState.timer <= 0) {
      this.gameState.isGameOver = true;
    }
  }
}
```

---

## Module Organization

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
│   └── Camera.js           # Viewport/scrolling logic
├── entities/
│   ├── Player.js           # Player/cursor logic
│   ├── Coin.js             # Collectible coins
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

---

## Event System (Optional - Phase 2+)

For decoupling components:

```javascript
class EventBus {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach((cb) => cb(data));
    }
  }
}

// Usage:
eventBus.emit('coin:collected', { x: 10, y: 5, points: 10 });
eventBus.on('coin:collected', (data) => {
  gameState.score += data.points;
  audioManager.play('coin');
});
```

---

## Technology Decisions Summary

| Decision             | Choice                                 | Rationale                            |
| -------------------- | -------------------------------------- | ------------------------------------ |
| **Language**         | Vanilla JavaScript (ES2022)            | Simple, no compilation overhead      |
| **Framework**        | None (for now)                         | Keep it lightweight, can add later   |
| **Rendering**        | DOM-based (Phase 1)                    | Faster development, easier debugging |
| **State Management** | Centralized object                     | Simple, easy to serialize for saves  |
| **Game Loop**        | requestAnimationFrame + fixed timestep | Smooth, consistent across devices    |
| **Testing**          | Vitest (unit) + Playwright (E2E)       | Modern, fast, good DX                |
| **Build Tool**       | Vite                                   | Fast, modern, great dev experience   |

---

## Design Patterns Used

1. **Module Pattern**: ES modules for code organization
2. **Singleton Pattern**: GameState, InputManager
3. **Strategy Pattern**: Mode handlers for different Vim modes
4. **Observer Pattern**: Event bus for decoupled communication (Phase 2+)
5. **State Pattern**: Screen management (Menu, Playing, Complete, Failed)

---

## Performance Considerations

### Phase 1 (MVP)

- Keep DOM updates minimal (only re-render changed elements)
- Use CSS transforms for movement (GPU-accelerated)
- Debounce/throttle expensive operations
- Profile with browser DevTools

### Future Optimization (Phase 3+)

- Consider Canvas migration if DOM becomes bottleneck
- Object pooling for particles
- Spatial hashing for collision detection
- Web Workers for heavy computations (if needed)

---

## Accessibility Considerations

- Keyboard-only navigation (natural fit for Vim game!)
- High contrast mode option
- Screen reader announcements for score/timer updates
- Adjustable font sizes
- Color-blind friendly palette

---

This architecture is designed to be:

- ✅ **Simple**: Easy to understand and modify
- ✅ **Modular**: Components can be developed independently
- ✅ **Testable**: Clear separation of concerns
- ✅ **Extensible**: Ready for Phase 2+ features
- ✅ **Maintainable**: Well-organized, documented code
