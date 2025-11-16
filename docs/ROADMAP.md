# Roadmap

High-level overview of development phases. See [TASKS.md](../TASKS.md) for detailed task breakdown.

---

## Phase 1: Core Prototype (MVP) ✅

**Status**: Core Prototype Complete - Polish Phase In Progress
**Goal**: Prove the core gameplay loop is fun
**Development Approach**: Build from outside-in (screens → navigation → game mechanics)

### Core Systems ✅

- [x] **Screen Management System** - Menu, game, level complete/failed screens with transitions ✅
- [x] **Main Menu** - Start/continue game, local leaderboard, instructions ✅
- [x] **LocalStorage & Save System** - Save/load game progress, leaderboard management ✅
- [x] **Command Mode** - Command parsing, UI overlay, `:q`, `:quit`, `:help` commands ✅
- [x] **Tutorial Level 0** - "How to Quit Vim" interactive tutorial ✅

### Gameplay Mechanics ✅

- [x] **Map Generation** - Procedural document-like maps with blocks and coins ✅
- [x] **Player Movement** - Basic `hjkl` navigation with collision detection ✅
- [x] **Collectibles & Scoring** - Coin collection, point system ✅
- [x] **Timer System** - 60-second countdown with game loop ✅
- [x] **HUD** - Score display, timer, mode indicator ✅

### Game Flow ✅

- [x] **Win/Lose Conditions** - All coins collected (win) or timer expires (lose) ✅
- [x] **Level End Screens** - Score display, restart/retry/menu options ✅
- [x] **State Management** - Game state transitions and persistence ✅

### Testing & Polish (In Progress)

- [x] **Unit Tests** - 20+ test files covering all core systems (100% passing) ✅
- [x] **E2E Tests** - 16 tests covering critical user flows (CI/CD ready) ✅
- [x] **CI/CD Pipeline** - GitHub Actions with automated testing ✅
- [ ] **Playtesting** - Tune difficulty, timing, and controls
- [ ] **Code Quality** - JSDoc comments, refactoring, performance profiling
- [ ] **Documentation** - Architecture diagrams, setup instructions

**Success Criteria**: ✅ Playable end-to-end, ✅ responsive controls, ✅ engaging core loop

---

## Phase 2: Power-up System �

**Goal**: Introduce vim motion progression

- [ ] **Power-up Collection** - Unlock system for new vim motions
- [ ] **Word Movement** - `w`, `b`, `e` motions
- [ ] **Cooldown System** - Visual badges with sweep-second animation
- [ ] **Stack System** - Multiple uses of same power-up
- [ ] **Tutorial Popups** - Contextual hints for new mechanics
- [ ] **Progressive Levels** - 5 levels with increasing difficulty

**Success Criteria**: Players learn word-based motions, progression feels rewarding

---

## Phase 3: Visual Polish 📋

**Goal**: Make the game feel juicy and satisfying

- [ ] **Cursor Movement Effects** - Rocket trails, motion blur, jello distortion
- [ ] **Particle Effects** - Collection, hits, combos
- [ ] **Sound Effects** - Movement, collection, UI sounds
- [ ] **Background Music** - Dynamic intensity based on timer/combo
- [ ] **Combo System** - Visual feedback for efficient movement chains
- [ ] **Theme System** - Multiple color schemes (retro, matrix, solarized)
- [ ] **Performance Optimization** - Evaluate Canvas vs DOM rendering

**Success Criteria**: Game feels responsive and exciting, visual feedback reinforces actions

---

## Phase 4: Advanced Mechanics 📋

**Goal**: Introduce complex vim modes and obstacles

- [ ] **Visual Mode** - Select, yank, delete, paste mechanics
- [ ] **Insert Mode** - Typing challenges and puzzles
- [ ] **Line Jumps** - `0`, `$`, `^` motions
- [ ] **Paragraph Navigation** - `{`, `}` motions
- [ ] **Obstacle System** - Stationary and moving obstacles
- [ ] **Health System** - Multiple lives, damage mechanics
- [ ] **15 Total Levels** - Full difficulty curve

**Success Criteria**: Advanced vim motions learnable through gameplay, obstacles add challenge

---

## Phase 5: Progression & Polish 📋

**Goal**: Create long-term engagement

- [ ] **XP & Leveling** - Player progression system
- [ ] **Persistent Unlocks** - Permanent upgrades across sessions
- [ ] **Global Leaderboards** - Requires backend server
- [ ] **Achievements** - Milestone tracking and rewards
- [ ] **Find Commands** - `f`, `F`, `/` search motions
- [ ] **Concept Obstacles** - Macro barriers, text puzzles
- [ ] **25+ Levels** - Extended content
- [ ] **Final UI Polish** - Menu systems, settings, themes

**Success Criteria**: Players return to game, feel progression, mastery is rewarding

---

## Phase 6: Community & Content 💭

**Goal**: Expand replayability and community engagement

- [ ] **Daily Challenges** - New challenges distributed to all players
- [ ] **Custom Level Editor** - Community-created content
- [ ] **Speedrun Mode** - Time attack with leaderboards
- [ ] **Social Features** - Share scores, replay viewing
- [ ] **Mobile Optimization** - Bluetooth keyboard support
- [ ] **Additional Motions** - Macros, marks, registers

**Success Criteria**: Active player community, high replay value

---

## Development Philosophy

**Build from Outside-In**: Start with screens and navigation, then add game mechanics

**Iterative Development**: Build → playtest → refine

**Fun First**: Prioritize gameplay feel over features

**Testing Strategy**:

- **Unit Tests** (Vitest): Development feedback, run on pre-commit
- **E2E Tests** (Playwright): Deployment gate, run on pre-push

**Technology Stack**:

- Vanilla JavaScript (ES modules)
- DOM-based rendering (Phase 1), evaluate Canvas in Phase 3
- LocalStorage for saves (Phase 1-4), backend server in Phase 5+
- Vite for build tooling

---

**Current Status**: Phase 1 Core Prototype Complete (~95%) - Polish tasks remaining
**Next Milestone**: Complete Phase 1 polish (playtesting, code quality, documentation)
**Major Achievements**:

- ✅ Fully playable game with hjkl movement, coin collection, win/lose conditions
- ✅ 160+ tasks completed across 19 major sections
- ✅ 20+ unit test files + 16 E2E tests, all passing
- ✅ Full CI/CD pipeline with GitHub Actions

**What's Left**: Playtesting, performance tuning, JSDoc comments, architecture diagrams

For detailed task breakdown, see [TASKS.md](../TASKS.md) and [DONE.md](../DONE.md)
