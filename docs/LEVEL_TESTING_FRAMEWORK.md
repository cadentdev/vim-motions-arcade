# Standalone Level Generation & Testing Framework

**Status:** Planning
**Date:** December 2025
**Purpose:** Enable rapid iteration on level design and game mechanics independent of the main game flow

---

## Executive Summary

This document describes a standalone level generation and testing framework that allows developers and designers to:

1. Launch directly into any level configuration without navigating menus
2. Test procedural generation with specific seeds and parameters
3. Create and test static hand-crafted levels
4. Validate levels are completable and balanced
5. Measure difficulty metrics and gameplay quality
6. Integrate tested levels seamlessly into the full game

The framework prioritizes rapid iteration speed while establishing data structures that will support the full game's progression system.

---

## Goals & Non-Goals

### Goals

- **Fast iteration**: Launch a level in under 1 second from code change
- **Reproducibility**: Same seed/config always produces same level
- **Isolation**: Test levels without save system, menus, or progression
- **Metrics**: Automatically calculate difficulty and balance metrics
- **Flexibility**: Support both procedural and hand-crafted levels
- **Integration path**: Data structures map directly to full game

### Non-Goals

- Not replacing the full game flow (menus, saves, progression)
- Not a visual level editor (though could be added later)
- Not multiplayer or networked testing

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Entry Points                                  │
├─────────────────────────────────────────────────────────────────┤
│  standalone.html     │  URL params        │  test-level.js CLI   │
│  (dev server page)   │  (?seed=123&...)   │  (headless testing)  │
└──────────┬───────────┴─────────┬──────────┴──────────┬──────────┘
           │                     │                     │
           ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LevelRunner                                   │
│  - Bypasses ScreenManager                                        │
│  - Loads level from LevelDefinition                              │
│  - Initializes GameCoordinator directly                          │
│  - Provides debug controls and overlays                          │
└──────────────────────────────┬──────────────────────────────────┘
                               │
           ┌───────────────────┼───────────────────┐
           ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ LevelDefinition │  │ LevelValidator  │  │ LevelMetrics    │
│ - Schema        │  │ - Completable?  │  │ - Difficulty    │
│ - Serialization │  │ - Coin access?  │  │ - Optimal path  │
│ - Factories     │  │ - Boundaries?   │  │ - Balance score │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## Data Structures

### LevelDefinition Schema

The core data structure representing a complete level configuration. This schema will be used both for testing and in the full game's level progression.

```javascript
/**
 * @typedef {Object} LevelDefinition
 *
 * Complete specification for a playable level
 */
{
  // === Identity ===
  id: string,              // Unique identifier, e.g., "level-001", "tutorial-quit"
  name: string,            // Display name, e.g., "First Steps"
  description: string,     // Optional description for level select

  // === Generation Mode ===
  generationMode: "procedural" | "static" | "hybrid",

  // === Procedural Generation Config (when generationMode includes procedural) ===
  procedural: {
    seed: number | null,   // null = random seed each play
    width: number,         // Map width in characters (default: 40)
    height: number,        // Map height in lines (default: 20)
    difficulty: number,    // 1-10 scale affecting density/complexity

    // Word generation parameters
    wordLengthMin: number,      // Minimum word length (default: 3)
    wordLengthMax: number,      // Maximum word length (default: 10)
    wordsPerLineMin: number,    // Minimum words per line (default: 2)
    wordsPerLineMax: number,    // Maximum words per line (default: 5)
    blankLineProbability: number, // 0-1, chance of paragraph break (default: 0.2)

    // Coin placement rules
    coinDensity: number,        // Coins per 100 characters (default: 5)
    coinPlacement: "word-boundaries" | "random" | "strategic",
  },

  // === Static Level Config (when generationMode is "static" or "hybrid") ===
  static: {
    // Pre-defined map structure
    blocks: [
      { x: number, y: number, width: number, text: string }
    ],

    // Pre-defined coin positions
    coins: [
      { x: number, y: number, value: number }
    ],

    // Pre-defined player start position (optional, defaults to 0,0)
    playerStart: { x: number, y: number },
  },

  // === Game Rules ===
  rules: {
    timeLimit: number,          // Seconds (default: 60)
    allowedMotions: string[],   // e.g., ["h", "j", "k", "l", "w", "b"]
    winCondition: "all-coins" | "reach-goal" | "custom",
    loseCondition: "timeout" | "damage" | "custom",

    // Scoring multipliers
    basePointsPerCoin: number,  // Default: 10
    timeBonusMultiplier: number, // Default: 1.0
    perfectClearBonus: number,  // Default: 1000
  },

  // === Display Settings ===
  display: {
    theme: string,              // Theme identifier (default: "default")
    showTimer: boolean,         // Default: true
    showScore: boolean,         // Default: true
    showModeIndicator: boolean, // Default: true
  },

  // === Metadata ===
  metadata: {
    author: string,
    version: string,
    createdAt: string,          // ISO date
    tags: string[],             // e.g., ["tutorial", "hjkl-only", "speed-run"]

    // Computed/cached metrics (populated by LevelMetrics)
    metrics: LevelMetrics | null,
  }
}
```

### LevelMetrics Schema

Computed metrics that describe level characteristics and difficulty.

```javascript
/**
 * @typedef {Object} LevelMetrics
 *
 * Computed statistics about a level
 */
{
  // === Completability ===
  isCompletable: boolean,       // Can all coins be reached from start?

  // === Size Metrics ===
  totalBlocks: number,          // Number of text blocks
  totalCoins: number,           // Number of coins to collect
  mapArea: number,              // width * height

  // === Difficulty Metrics ===
  coinDensity: number,          // Coins per 100 cells
  averageDistanceBetweenCoins: number,
  maxDistanceFromStart: number, // Furthest coin from player start

  // === Path Analysis ===
  optimalMoves: number,         // Minimum moves to collect all coins
  optimalPath: Move[],          // Sequence of optimal moves
  optimalTime: number,          // Estimated time for optimal play (seconds)

  // === Motion Requirements ===
  requiredMotions: string[],    // Minimum motions needed to complete
  beneficialMotions: string[],  // Motions that would help but aren't required

  // === Balance Score ===
  difficultyRating: number,     // 1-10 computed difficulty
  timeAdequacy: number,         // Ratio of timeLimit to optimalTime (>1 = enough time)

  // === Validation Warnings ===
  warnings: string[],           // e.g., ["Some coins may be unreachable with hjkl only"]
}
```

### LevelProgress Schema

Player progress through a level (for save/load and replay).

```javascript
/**
 * @typedef {Object} LevelProgress
 *
 * Current state of a level playthrough
 */
{
  // === Level Reference ===
  levelId: string,
  seed: number | null,          // For procedural levels

  // === Player State ===
  playerPosition: { x: number, y: number },
  playerMode: "normal" | "insert" | "visual" | "command",

  // === Collection State ===
  collectedCoins: number[],     // Indices of collected coins
  score: number,

  // === Timing ===
  timeRemaining: number,
  elapsedTime: number,

  // === Movement History (for replay/analysis) ===
  moveHistory: Move[],

  // === Completion State ===
  status: "in-progress" | "completed" | "failed",
  completionTime: number | null,
  finalScore: number | null,
}
```

### LevelPack Schema

Collection of levels for organization and progression.

```javascript
/**
 * @typedef {Object} LevelPack
 *
 * A collection of related levels
 */
{
  id: string,                   // e.g., "tutorial", "chapter-1"
  name: string,                 // Display name
  description: string,

  // === Level List ===
  levels: string[],             // Array of level IDs in order

  // === Unlock Requirements ===
  unlockCondition: "none" | "previous-complete" | "score-threshold" | "custom",
  unlockThreshold: number | null,

  // === Pack Metadata ===
  totalLevels: number,
  estimatedPlaytime: number,    // Minutes
  difficulty: "beginner" | "intermediate" | "advanced" | "expert",

  // === Progression Tracking ===
  motionsIntroduced: string[],  // New motions taught in this pack
}
```

---

## Standalone Level Runner

### Entry Point: `standalone.html`

A dedicated HTML page that bypasses the main game flow and loads directly into gameplay.

**Location:** `/standalone.html` (root of project)

**Behavior:**

1. Parses URL parameters for level configuration
2. Initializes LevelRunner instead of main.js flow
3. Renders debug overlay and controls
4. Provides instant restart and parameter adjustment

### URL Parameter API

```
/standalone.html?mode=procedural&seed=12345&difficulty=3&width=40&height=20
/standalone.html?mode=static&level=tutorial-001
/standalone.html?mode=procedural&seed=random&motions=hjkl
```

**Supported Parameters:**

| Parameter    | Type          | Default      | Description                                    |
| ------------ | ------------- | ------------ | ---------------------------------------------- |
| `mode`       | string        | "procedural" | "procedural", "static", or level ID            |
| `seed`       | number/string | random       | Seed for procedural generation, or "random"    |
| `difficulty` | number        | 3            | 1-10 difficulty scale                          |
| `width`      | number        | 40           | Map width in characters                        |
| `height`     | number        | 20           | Map height in lines                            |
| `time`       | number        | 60           | Time limit in seconds                          |
| `motions`    | string        | "hjkl"       | Allowed motions (comma-separated or shorthand) |
| `debug`      | boolean       | true         | Show debug overlay                             |
| `metrics`    | boolean       | false        | Compute and display metrics                    |

### LevelRunner Class

```javascript
/**
 * LevelRunner - Standalone level execution environment
 *
 * Responsibilities:
 * - Parse configuration from URL or programmatic input
 * - Initialize GameCoordinator with level data
 * - Render debug overlay
 * - Handle instant restart and parameter changes
 * - Collect playthrough data for analysis
 */
class LevelRunner {
  constructor(config: LevelRunnerConfig)

  // Lifecycle
  init(): Promise<void>
  start(): void
  restart(): void
  destroy(): void

  // Configuration
  updateConfig(newConfig: Partial<LevelRunnerConfig>): void
  regenerateLevel(): void

  // Debug Controls
  toggleDebugOverlay(): void
  togglePause(): void
  skipToWin(): void
  skipToLose(): void

  // Metrics
  computeMetrics(): LevelMetrics
  exportLevel(): LevelDefinition
  exportProgress(): LevelProgress
}
```

---

## Debug Overlay

The debug overlay provides real-time information and controls during level testing.

### Debug Panel Sections

```
┌─────────────────────────────────────────┐
│ DEBUG MODE                    [X] Close │
├─────────────────────────────────────────┤
│ Level Info                              │
│ ├─ Seed: 12345                          │
│ ├─ Size: 40x20                          │
│ ├─ Difficulty: 3                        │
│ ├─ Coins: 8/15 collected                │
│ └─ Blocks: 47                           │
├─────────────────────────────────────────┤
│ Player                                  │
│ ├─ Position: (12, 5)                    │
│ ├─ Mode: NORMAL                         │
│ ├─ Moves: 23                            │
│ └─ On block: "function"                 │
├─────────────────────────────────────────┤
│ Metrics                                 │
│ ├─ Optimal moves: 45                    │
│ ├─ Your moves: 23                       │
│ ├─ Efficiency: 51%                      │
│ └─ Time adequacy: 1.8x                  │
├─────────────────────────────────────────┤
│ Controls                                │
│ [R] Restart  [P] Pause  [M] Metrics     │
│ [+] Difficulty  [-] Difficulty          │
│ [N] New Seed   [E] Export               │
└─────────────────────────────────────────┘
```

### Debug Visualization Modes

Toggle-able overlays for map analysis:

1. **Coin Visibility**: Highlight all coin positions (even behind player)
2. **Grid Overlay**: Show character grid for precise positioning
3. **Optimal Path**: Visualize the computed optimal path through coins
4. **Reachability Heatmap**: Color cells by distance from player start
5. **Block Boundaries**: Show exact boundaries of text blocks

### Keyboard Shortcuts (Debug Mode)

| Key   | Action                             |
| ----- | ---------------------------------- |
| `F1`  | Toggle debug panel                 |
| `F2`  | Toggle coin visibility overlay     |
| `F3`  | Toggle grid overlay                |
| `F4`  | Toggle optimal path display        |
| `F5`  | Regenerate with new random seed    |
| `F6`  | Export current level as JSON       |
| `F7`  | Copy level URL to clipboard        |
| `F8`  | Toggle pause                       |
| `F9`  | Instant win (skip to completion)   |
| `F10` | Instant lose (skip to failure)     |
| `F11` | Increase difficulty and regenerate |
| `F12` | Decrease difficulty and regenerate |

---

## Level Validation

### LevelValidator Class

Ensures levels are playable and meet quality standards.

```javascript
/**
 * LevelValidator - Validates level completability and quality
 */
class LevelValidator {
  /**
   * Run all validations on a level
   * @returns ValidationResult with pass/fail and detailed issues
   */
  validate(level: LevelDefinition): ValidationResult

  // Individual validations
  validateCompletability(level): ValidationIssue[]
  validateCoinAccessibility(level): ValidationIssue[]
  validateBoundaries(level): ValidationIssue[]
  validateTimeAdequacy(level): ValidationIssue[]
  validateMotionRequirements(level): ValidationIssue[]
}
```

### Validation Checks

| Check                  | Description                           | Severity |
| ---------------------- | ------------------------------------- | -------- |
| **Coin Accessibility** | All coins reachable from player start | Error    |
| **Time Adequacy**      | Time limit >= 1.5x optimal path time  | Warning  |
| **Motion Sufficiency** | Allowed motions can reach all coins   | Error    |
| **Boundary Validity**  | All coins/blocks within map bounds    | Error    |
| **Block Overlap**      | No overlapping text blocks            | Warning  |
| **Coin Overlap**       | No coins on same position             | Error    |
| **Empty Level**        | Level has at least 1 coin             | Error    |
| **Start Position**     | Player start is valid position        | Error    |
| **Difficulty Match**   | Computed difficulty matches declared  | Info     |

### ValidationResult Schema

```javascript
{
  isValid: boolean,           // True if no errors
  errors: ValidationIssue[],  // Critical issues (level unplayable)
  warnings: ValidationIssue[],// Non-critical issues (may affect balance)
  info: ValidationIssue[],    // Informational notes
}

// ValidationIssue
{
  code: string,               // e.g., "COIN_UNREACHABLE"
  message: string,            // Human-readable description
  severity: "error" | "warning" | "info",
  location: { x: number, y: number } | null,
  details: object,            // Additional context
}
```

---

## Level Metrics Computation

### LevelMetricsCalculator Class

Computes difficulty and balance metrics for levels.

```javascript
/**
 * LevelMetricsCalculator - Analyzes level characteristics
 */
class LevelMetricsCalculator {
  /**
   * Compute all metrics for a level
   */
  calculate(level: LevelDefinition): LevelMetrics

  // Individual calculations
  calculateOptimalPath(level): { moves: Move[], totalMoves: number }
  calculateDifficultyRating(level): number
  calculateTimeAdequacy(level): number
  calculateMotionRequirements(level): { required: string[], beneficial: string[] }
}
```

### Optimal Path Algorithm

Uses pathfinding to determine minimum moves to collect all coins:

1. **Graph Construction**: Build navigation graph from map
2. **TSP Approximation**: Find efficient coin collection order
3. **Path Planning**: Calculate moves between each coin pair
4. **Motion Optimization**: Determine best vim motion for each move

### Difficulty Rating Formula

```
difficultyRating = weighted_average(
  coinDensity * 0.15,
  averageDistanceBetweenCoins * 0.20,
  optimalMoves / mapArea * 0.25,
  requiredMotions.length * 0.20,
  1 / timeAdequacy * 0.20
)
```

Normalized to 1-10 scale.

---

## Headless Testing Mode

### CLI Test Runner

For automated testing in CI/CD pipelines.

**Usage:**

```bash
# Test a specific level configuration
npm run test:level -- --seed=12345 --difficulty=5

# Validate a level file
npm run test:level -- --validate levels/tutorial-001.json

# Generate and validate N random levels
npm run test:level -- --fuzz 100 --difficulty-range=1-10

# Compute metrics for a level
npm run test:level -- --metrics levels/chapter1-level5.json
```

### Automated Test Scenarios

```javascript
/**
 * Level testing scenarios for automated QA
 */
describe('Level Generation', () => {
  describe('Procedural Levels', () => {
    it('generates completable levels for difficulty 1-5', () => {});
    it('generates completable levels for difficulty 6-10', () => {});
    it('same seed produces identical levels', () => {});
    it('different seeds produce different levels', () => {});
    it('respects width/height parameters', () => {});
    it('respects coin density parameter', () => {});
  });

  describe('Validation', () => {
    it('detects unreachable coins', () => {});
    it('detects insufficient time limit', () => {});
    it('detects out-of-bounds elements', () => {});
    it('validates motion requirements match allowed motions', () => {});
  });

  describe('Metrics', () => {
    it('computes accurate optimal path', () => {});
    it('difficulty rating correlates with parameters', () => {});
    it('time adequacy reflects actual playability', () => {});
  });

  describe('Regression', () => {
    it('known seeds produce expected metrics', () => {});
    it('level definitions load without errors', () => {});
  });
});
```

---

## Integration with Full Game

### Level Registry

Central registry that maps level IDs to definitions.

```javascript
/**
 * LevelRegistry - Central store for all level definitions
 */
class LevelRegistry {
  // Registration
  register(definition: LevelDefinition): void
  registerPack(pack: LevelPack): void

  // Retrieval
  get(levelId: string): LevelDefinition
  getPack(packId: string): LevelPack
  getAll(): LevelDefinition[]

  // Queries
  getLevelsByTag(tag: string): LevelDefinition[]
  getLevelsByDifficulty(min: number, max: number): LevelDefinition[]
  getNextLevel(currentLevelId: string): LevelDefinition | null

  // Progression helpers
  getLevelsForMotion(motion: string): LevelDefinition[]
  getTutorialLevels(): LevelDefinition[]
}
```

### Progression System Interface

How levels connect to the full game's progression:

```javascript
/**
 * ProgressionManager - Tracks player progress across levels
 */
class ProgressionManager {
  // Level completion
  markLevelComplete(levelId: string, progress: LevelProgress): void
  isLevelComplete(levelId: string): boolean
  getLevelBestScore(levelId: string): number | null

  // Pack progression
  isPackUnlocked(packId: string): boolean
  getPackProgress(packId: string): { completed: number, total: number }

  // Unlocks
  getUnlockedMotions(): string[]
  unlockMotion(motion: string): void

  // Persistence
  save(): void
  load(): void
}
```

### Migration Path

1. **Phase 1**: Standalone framework with URL-based level loading
2. **Phase 2**: Level Registry populated with test levels
3. **Phase 3**: ProgressionManager integration for full game
4. **Phase 4**: Level pack system and unlock logic

---

## File Organization

```
src/
├── levels/
│   ├── LevelDefinition.js     # Schema and factories
│   ├── LevelRunner.js         # Standalone execution
│   ├── LevelValidator.js      # Validation logic
│   ├── LevelMetrics.js        # Metrics calculation
│   ├── LevelRegistry.js       # Level storage/retrieval
│   └── definitions/
│       ├── tutorial/          # Tutorial level definitions
│       │   ├── quit-vim.js
│       │   └── hjkl-basics.js
│       ├── chapter1/          # Chapter 1 level definitions
│       └── procedural/        # Procedural generation presets
│           ├── easy.js
│           ├── medium.js
│           └── hard.js
│
├── debug/
│   ├── DebugOverlay.js        # Debug panel UI
│   ├── DebugVisualizations.js # Map overlays
│   └── DebugControls.js       # Keyboard shortcuts
│
tests/
├── unit/
│   └── levels/
│       ├── LevelDefinition.test.js
│       ├── LevelValidator.test.js
│       ├── LevelMetrics.test.js
│       └── LevelRunner.test.js
│
├── integration/
│   └── levels/
│       ├── procedural-generation.test.js
│       └── level-progression.test.js
│
standalone.html                 # Standalone entry point
```

---

## Implementation Roadmap

### Phase 1: Core Infrastructure

**Priority:** Critical
**Dependencies:** None

| Task                          | Description                        | Estimated Complexity |
| ----------------------------- | ---------------------------------- | -------------------- |
| Create LevelDefinition schema | Define TypeScript/JSDoc interfaces | Low                  |
| Create LevelRunner class      | Basic standalone execution         | Medium               |
| Create standalone.html        | Entry point with URL parsing       | Low                  |
| Basic debug overlay           | Show seed, position, coins         | Medium               |
| Unit tests for schemas        | Validate serialization             | Low                  |

**Deliverable:** Can launch into a procedural level via URL

### Phase 2: Validation & Metrics

**Priority:** High
**Dependencies:** Phase 1

| Task                         | Description                        | Estimated Complexity |
| ---------------------------- | ---------------------------------- | -------------------- |
| LevelValidator class         | Completability and boundary checks | Medium               |
| Coin accessibility algorithm | Pathfinding for reachability       | Medium               |
| LevelMetrics calculator      | Difficulty and optimal path        | High                 |
| Validation test suite        | Cover all validation rules         | Medium               |
| Metrics visualization        | Display in debug overlay           | Low                  |

**Deliverable:** Levels are validated and metrics displayed

### Phase 3: Debug Tools

**Priority:** Medium
**Dependencies:** Phase 2

| Task                     | Description                     | Estimated Complexity |
| ------------------------ | ------------------------------- | -------------------- |
| Full debug overlay UI    | All panels and controls         | Medium               |
| Visualization overlays   | Grid, path, heatmap             | Medium               |
| Debug keyboard shortcuts | All F-key bindings              | Low                  |
| Level export (JSON)      | Export current level definition | Low                  |
| URL generation           | Copy shareable level URL        | Low                  |

**Deliverable:** Full debug toolkit for level testing

### Phase 4: Static Levels & Registry

**Priority:** Medium
**Dependencies:** Phase 1

| Task                       | Description                 | Estimated Complexity |
| -------------------------- | --------------------------- | -------------------- |
| Static level format        | Hand-crafted level loading  | Medium               |
| LevelRegistry class        | Central level storage       | Medium               |
| Tutorial level definitions | Initial tutorial content    | Medium               |
| Level pack schema          | Organize levels into groups | Low                  |

**Deliverable:** Can create and load hand-crafted levels

### Phase 5: Headless Testing

**Priority:** Medium
**Dependencies:** Phase 2

| Task                 | Description                    | Estimated Complexity |
| -------------------- | ------------------------------ | -------------------- |
| CLI test runner      | npm script for level testing   | Medium               |
| Fuzz testing         | Generate and validate N levels | Medium               |
| Regression snapshots | Known-good level outputs       | Low                  |
| CI integration       | Run level tests in pipeline    | Low                  |

**Deliverable:** Automated level validation in CI

### Phase 6: Game Integration

**Priority:** Low (after core game features)
**Dependencies:** Phases 1-4

| Task                        | Description                | Estimated Complexity |
| --------------------------- | -------------------------- | -------------------- |
| ProgressionManager          | Track level completion     | Medium               |
| GameCoordinator integration | Load levels from registry  | Medium               |
| Level select screen         | UI for choosing levels     | Medium               |
| Unlock system               | Motion unlocks from levels | Medium               |

**Deliverable:** Framework fully integrated with game

---

## Testing Strategy

### Unit Tests

| Component       | Key Test Cases                                      |
| --------------- | --------------------------------------------------- |
| LevelDefinition | Schema validation, serialization, factory functions |
| LevelRunner     | Initialization, restart, config updates             |
| LevelValidator  | Each validation rule, edge cases                    |
| LevelMetrics    | Path calculation, difficulty scoring                |
| LevelRegistry   | Registration, retrieval, queries                    |

### Integration Tests

| Scenario              | Description                                     |
| --------------------- | ----------------------------------------------- |
| Procedural generation | Generate levels, validate, compute metrics      |
| Static level loading  | Load JSON, play through, verify behavior        |
| Full game flow        | Level select → play → complete → progress saved |

### E2E Tests

| Flow                  | Description                               |
| --------------------- | ----------------------------------------- |
| Standalone happy path | Load URL → play → collect all coins → win |
| Debug controls        | Use debug shortcuts, verify behavior      |
| Level validation      | Load invalid level, verify error display  |

---

## QA Checklist

### Level Generation Quality

- [ ] Procedural levels are always completable with allowed motions
- [ ] Same seed always produces identical level
- [ ] Difficulty parameter affects level characteristics
- [ ] Coin placement follows specified rules
- [ ] No coins or blocks outside map boundaries

### Debug Tools

- [ ] Debug overlay displays accurate information
- [ ] All keyboard shortcuts function correctly
- [ ] Level export produces valid JSON
- [ ] Generated URLs load correct level

### Validation

- [ ] Validator catches unreachable coins
- [ ] Validator warns about insufficient time
- [ ] Validator reports motion requirements
- [ ] Validation runs quickly (<100ms)

### Metrics

- [ ] Optimal path is actually optimal
- [ ] Difficulty rating correlates with player experience
- [ ] Time adequacy reflects actual playability
- [ ] Metrics are deterministic for same level

### Integration

- [ ] LevelRegistry loads all level definitions
- [ ] GameCoordinator accepts LevelDefinition input
- [ ] Progress saves correctly reference levels
- [ ] Level packs track completion correctly

---

## Open Questions

1. **Level Editor**: Should we build a visual level editor, or is JSON-based definition sufficient?

2. **Replay System**: Should LevelProgress support full replay for debugging and sharing?

3. **Procedural Presets**: What named difficulty presets should we provide (e.g., "easy", "medium", "hard")?

4. **Validation Strictness**: Should validation errors block level loading, or just warn?

5. **Metrics Caching**: Should computed metrics be cached in level files, or computed on-demand?

---

## Appendix: Example Level Definitions

### Procedural Level (Easy)

```javascript
{
  id: "procedural-easy-001",
  name: "Warm Up",
  generationMode: "procedural",
  procedural: {
    seed: null,  // Random each time
    width: 30,
    height: 15,
    difficulty: 2,
    coinDensity: 3,
    coinPlacement: "word-boundaries"
  },
  rules: {
    timeLimit: 90,
    allowedMotions: ["h", "j", "k", "l"],
    winCondition: "all-coins"
  },
  metadata: {
    tags: ["beginner", "hjkl-only"]
  }
}
```

### Static Tutorial Level

```javascript
{
  id: "tutorial-hjkl",
  name: "Movement Basics",
  generationMode: "static",
  static: {
    blocks: [
      { x: 0, y: 0, width: 7, text: "Welcome" },
      { x: 10, y: 0, width: 2, text: "to" },
      { x: 15, y: 0, width: 3, text: "vim" },
      { x: 0, y: 2, width: 3, text: "Use" },
      { x: 5, y: 2, width: 4, text: "hjkl" },
      { x: 12, y: 2, width: 6, text: "to" }
    ],
    coins: [
      { x: 0, y: 0, value: 10 },
      { x: 15, y: 0, value: 10 },
      { x: 5, y: 2, value: 10 }
    ],
    playerStart: { x: 10, y: 0 }
  },
  rules: {
    timeLimit: 120,
    allowedMotions: ["h", "j", "k", "l"],
    winCondition: "all-coins"
  },
  metadata: {
    author: "system",
    tags: ["tutorial", "hjkl-only"]
  }
}
```

### Hybrid Level (Procedural with Fixed Elements)

```javascript
{
  id: "challenge-001",
  name: "Word Jump Gauntlet",
  generationMode: "hybrid",
  procedural: {
    seed: 99999,
    width: 60,
    height: 25,
    difficulty: 5,
    coinPlacement: "strategic"
  },
  static: {
    // Add specific coins on top of procedural map
    coins: [
      { x: 30, y: 12, value: 100 }  // Bonus coin in center
    ]
  },
  rules: {
    timeLimit: 45,
    allowedMotions: ["h", "j", "k", "l", "w", "b"],
    winCondition: "all-coins"
  },
  metadata: {
    tags: ["challenge", "word-motions", "speed-run"]
  }
}
```

---

**Document Version:** 1.0
**Last Updated:** December 2025
**Status:** Ready for Implementation Review
