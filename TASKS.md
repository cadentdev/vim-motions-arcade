# Vim Motions Arcade - Active Development Tasks

This document tracks **active** (incomplete) development tasks. Completed tasks are archived in [DONE.md](./DONE.md).

---

## Phase 1: Testing & Polish (In Progress)

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

## Quick Links

- **Completed Tasks**: See [DONE.md](./DONE.md)
- **Testing Guide**: See [docs/TESTING.md](./docs/TESTING.md)
- **Product Requirements**: See [docs/PRD.md](./docs/PRD.md)

---

**Status**: Phase 1 Core Prototype Complete - Now focusing on polish & testing
**Priority**: Complete remaining Phase 1 tasks before moving to Phase 2
**Next Milestone**: Phase 1 fully complete and deployable
