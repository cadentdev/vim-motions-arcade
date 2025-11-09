# Vim Motions Arcade - Product Requirements Document

## Executive Summary

Vim Motions Arcade is a character-based platformer game that teaches players vim text editor motions through engaging arcade gameplay. Players navigate a cursor block through procedurally-generated maps styled like vim documents, collecting power-ups that unlock new vim commands, gathering coins, and avoiding obstacles—all while racing against the clock.

**Core Hook**: Learn real vim motions while playing an addictive arcade game that makes muscle memory fun.

---

## Product Vision

### Goals
- Make learning vim motions intuitive and engaging through gameplay
- Create a progression system that mirrors actual vim learning curve (simple to complex)
- Build muscle memory for vim commands through repetition and reward
- Provide immediate, satisfying feedback for correct motion usage

### Target Audience
- Developers learning vim for the first time
- Experienced vim users wanting to improve speed and learn advanced motions
- Gaming enthusiasts interested in educational games
- Computer science students

---

## Game Overview

### Core Gameplay Loop
1. Player spawns at top of a procedurally-generated "document" map
2. Navigate cursor block using vim motions to collect coins and power-ups
3. Avoid obstacles (stationary blocks, projectiles, concept barriers)
4. Unlock new vim motions by collecting power-ups
5. Complete map before time expires to earn bonus points
6. Progress to harder levels with larger maps requiring advanced motions

### Win Conditions
- **Level Complete**: Collect all coins before time runs out
- **Perfect Clear Bonus**: Time-proportional bonus for early completion
- **Progression**: Accumulate experience to level up and unlock persistent upgrades

### Lose Conditions
- Time runs out before collecting all coins
- Hit too many obstacles (health system with multiple lives)

---

## Game Mechanics

### 1. Movement System

#### Basic Motions (Starting Power-ups)
- `h` - Move cursor left (character)
- `j` - Move cursor down (line)
- `k` - Move cursor up (line)
- `l` - Move cursor right (character)

#### Word-based Movement (Early unlocks)
- `w` - Jump to start of next word
- `b` - Jump to start of previous word
- `e` - Jump to end of current/next word

#### Line Movement (Mid-tier unlocks)
- `0` - Jump to start of line
- `$` - Jump to end of line
- `^` - Jump to first non-whitespace character

#### Paragraph/Block Movement (Advanced unlocks)
- `{` - Jump to previous blank line (paragraph up)
- `}` - Jump to next blank line (paragraph down)

#### Search-based Movement (Late-game unlocks)
- `f{char}` - Find next occurrence of character on line
- `F{char}` - Find previous occurrence of character on line
- `/pattern` - Search forward in document

#### Visual Mode Mechanics (Advanced)
- `v` - Enter visual mode to select text
- `y` - Yank (copy) selected text
- `d` - Delete selected text
- `p` - Paste yanked/deleted text
- Use cases: Reorder sentences/paragraphs to solve puzzles

#### Insert Mode Mechanics (Late-game)
- `i` - Enter insert mode at cursor
- Type to edit character sequences
- Use cases: Enter codes, solve word puzzles, complete challenges

### 2. Power-up System

#### Power-up Types
1. **Motion Unlocks**: Grant access to new vim commands
2. **Stack Upgrades**: Increase capacity to store multiple uses of same power-up
3. **Cooldown Reducers**: Decrease cooldown time for specific motions
4. **Combo Boosters**: Increase points earned from movement combos
5. **Time Extensions**: Add seconds to level timer
6. **Health/Shield**: Protect from obstacles

#### Cooldown Mechanics
- **Visual Indicator**: Round badge with clock-like "sweep-second" animation
- **Ready State**: Badge glows when power-up is available
- **Unavailable Attempt**: Red circle with diagonal slash + error sound
- **Cooldown Behavior**: Continues during all other actions
- **Stack System**: 
  - Default stack size: 1 (upgradeable through leveling)
  - HUD shows current stack count on badge
  - Rapid use: Can trigger stacked power-ups in quick succession
  - Example: 3x `}` jumps can be executed rapidly as "}}}""

#### Power-up Placement (Procedural Generation Rules)
- **Word-boundary Coins**: Placed at start/end of "words" to encourage `w`/`b` usage
- **Mid-word Coins**: Worth more points, require precise `h`/`l` navigation
- **Paragraph Coins**: Placed at blank lines to teach `{` and `}` motions
- **Line-end Coins**: Reward `$` and `0` usage

### 3. Obstacle System

#### Phase 1: Stationary Obstacles
- **Block Obstacles**: Immovable barriers requiring navigation around
- **Damage**: Contact reduces health/resets position

#### Phase 2: Dynamic Obstacles
- **Projectiles**: Moving obstacles with patterns
- **Timing Challenges**: Require precise motion timing

#### Phase 3: Concept Obstacles
- **Macro Barriers**: Require specific sequence of commands
- **Visual Mode Challenges**: Must yank/delete/paste to clear path
- **Insert Mode Puzzles**: Must edit text to proceed

### 4. Scoring System

#### Point Sources
- **Coins**: Base point value (word-boundary: 10pts, mid-word: 15pts)
- **Power-ups**: 50pts each + unlock benefit
- **Perfect Clear Bonus**: (Time Remaining / Total Time) × 1000
- **Combo Multiplier**: Consecutive efficient movements increase multiplier
  - Example: `w w w }` = 4x combo
  - Combo breaks on inefficient movement or obstacle hit
- **No-damage Bonus**: Complete level without hitting obstacles

#### Combo System
- **Efficient Movement**: Using optimal vim motion for distance traveled
- **Combo Chain**: Each consecutive efficient move adds to multiplier
- **Visual Feedback**: Combo counter with color intensity increase
- **Sound Feedback**: Pitch/intensity increases with combo level
- **Combo Breakers**: 
  - Inefficient movement (using `h` ten times instead of `w`)
  - Hitting obstacles
  - Extended pause (3+ seconds)

### 5. Level Progression

#### Map Generation
- **Procedural Generation**: Always randomized to prevent memorization
- **Document Structure**: Text-like layout with "words" and "paragraphs"
- **Difficulty Scaling**: 
  - Early levels: Small maps, `hjkl` + basic `w`/`b` sufficient
  - Mid levels: Larger maps, require line jumps and paragraph navigation
  - Late levels: Massive documents, require search and advanced motions
- **Layout Constraints**: Ensure maps are always completable with available motions

#### Difficulty Curve
- **Level 1-5**: `hjkl` and word movement (`w`, `b`, `e`)
- **Level 6-10**: Line jumps (`0`, `$`, `^`)
- **Level 11-15**: Paragraph navigation (`{`, `}`)
- **Level 16-20**: Find commands (`f`, `F`)
- **Level 21+**: Visual mode, macros, search, insert mode

#### Time Limits
- **Base Time**: 60 seconds (adjusts per level difficulty)
- **Scaling**: +10 seconds per difficulty tier
- **Time Bonuses**: 
  - +5 seconds per time extension power-up
  - +2 seconds per combo milestone (10x, 20x, etc.)

---

## Visual Design

### Core Aesthetic

#### Map/Document Area (Retro Terminal)
- **Blocks ("Words")**: Monospaced rectangular blocks, various widths
- **Spacing**: Single space between blocks (like words in text)
- **Cursor Block**: Player-controlled, distinct color with visual effects
- **Color Palette**: Retro arcade colors on dark/customizable background
- **Grid System**: Character-based grid (monospace alignment)

#### Unlockable Themes
- **Default**: Dark mode with vibrant retro colors
- **Classic**: Fallout-style green monochrome
- **Matrix**: Black background, green text/blocks
- **Solarized**: Popular vim color scheme
- **Custom**: Unlock color customization at high levels

#### Visual Effects

##### Cursor Movement Effects
- **Direction Indicator**: "Retro rocket" effect fires opposite to movement direction
- **Motion Blur**: Trail effect showing movement path
- **Jello Distortion**: Cursor squashes/stretches during acceleration/deceleration
- **Speed Variation**: 
  - Character moves (`h`/`l`): Minimal effects, subtle
  - Word jumps (`w`/`b`): Moderate acceleration, visible trail
  - Line/paragraph jumps: High-speed blur, dramatic rocket effect
  - Search movements: "Warp" effect with screen distortion

##### Power-up Effects
- **Collection**: Particle burst, sound effect, badge appears in HUD
- **Cooldown Ready**: Glowing pulse animation on badge
- **Unavailable**: Red slash icon, error sound, screen shake (subtle)

##### Environmental Effects
- **Obstacle Hit**: Screen shake, red flash, damage indicator
- **Combo Build**: Increasing glow around cursor, color intensity
- **Level Complete**: Confetti/particle celebration, score tally animation

### User Interface

#### HUD Elements (Modern, Clean Style)
1. **Power-up Bar**: 
   - Horizontal row of circular badges at top
   - Each badge shows: motion key, cooldown status, stack count
   - Glow effect when ready
   
2. **Score Display**: 
   - Top-right corner
   - Current score + combo multiplier
   
3. **Timer**: 
   - Top-center
   - Color changes as time runs low (green → yellow → red)
   
4. **Health/Lives**: 
   - Top-left corner
   - Heart icons or health bar
   
5. **Mode Indicator**: 
   - Bottom-left
   - Shows current mode (NORMAL, VISUAL, INSERT, COMMAND)
   - Distinct color per mode

6. **Available Commands Panel**:
   - Right side (collapsible)
   - Lists unlocked motions with key bindings
   - Highlights when ready to use

#### Popup System
- **Tutorial Prompts**: 
  - Appear contextually when new mechanic is introduced
  - "Press 'w' to jump to the next word!"
  - Semi-transparent overlay with clear typography
  
- **Power-up Notifications**: 
  - Brief popup showing what was unlocked
  - "New Motion Unlocked: `$` - Jump to end of line"
  
- **Hints System**: 
  - Optional hints if player is stuck
  - "Try using paragraph jumps `{` `}` to move faster!"

#### Menus (Modern UI)
- **Main Menu**: Start Game, Tutorial, Settings, Leaderboard, Quit
- **Pause Menu** (Command Mode: `:pause`): Resume, Settings, Quit
- **Settings**: Theme selection, sound volume, control remapping (future)
- **Level Complete Screen**: Score breakdown, stars earned, next level

---

## Audio Design

### Sound Effects

#### Movement Sounds (Vary by Motion Type)
- **Character Movement** (`h`, `j`, `k`, `l`): Soft click/tick
- **Word Jumps** (`w`, `b`, `e`): Quick "whoosh" sound
- **Line Jumps** (`0`, `$`, `^`): Medium "swoosh"
- **Paragraph Jumps** (`{`, `}`): Deep "boom" with echo
- **Search/Find**: Radar "ping" or scanning sound
- **Warp/Long Distance**: Sci-fi teleport sound

#### Gameplay Sounds
- **Coin Collect**: Classic arcade "bling"
- **Power-up Collect**: Power-up jingle (ascending notes)
- **Obstacle Hit**: Harsh buzz/error sound
- **Combo Build**: Rising pitch with each combo level
- **Combo Break**: Descending "wah-wah" sound
- **Cooldown Ready**: Soft "ding" notification
- **Unavailable Power-up**: Error "buzz"

#### UI Sounds
- **Menu Navigation**: Subtle click
- **Level Complete**: Victory fanfare
- **Level Failed**: Defeat sound
- **Mode Switch**: Distinct tone per mode

### Music
- **Menu Music**: Upbeat chiptune theme
- **Gameplay Music**: 
  - Dynamic intensity based on timer/combo
  - Retro electronic soundtrack
  - Tempo increases as time runs low
- **Level Complete**: Short victory stinger

---

## Vim Mode System

### Normal Mode (Default)
- **Purpose**: Standard gameplay mode for navigation
- **Available Actions**: All unlocked vim motions
- **Access**: Default state, return from other modes with `Esc`

### Command Mode
- **Purpose**: Game controls and meta-actions
- **Activation**: Press `:` (colon)
- **Available Commands**:
  - `:quit` or `:q` - Exit to main menu
  - `:pause` - Pause game
  - `:help` or `:h` - Open help/controls
  - `:restart` - Restart current level
  - `:save` - Save progress (auto-save also active)
  - `:settings` - Access settings menu
  - `:theme [name]` - Change theme (if unlocked)
- **Exit**: Press `Esc` or execute command

### Visual Mode (Mid-to-Late Game)
- **Purpose**: Select, manipulate blocks of text/objects
- **Activation**: Press `v`
- **Mechanics**:
  - Movement keys extend selection
  - `y` - Yank (copy) selected blocks
  - `d` - Delete selected blocks
  - `p` - Paste yanked/deleted blocks
- **Use Cases**:
  - Reorder sentences to spell a code
  - Move paragraphs to align pathways
  - Delete obstacle blocks (if power-up allows)
  - Solve word/text puzzles
- **Exit**: Press `Esc` or complete action

### Insert Mode (Late Game)
- **Purpose**: Edit character sequences
- **Activation**: Press `i` (at cursor)
- **Mechanics**:
  - Type to replace characters in cursor block
  - `Esc` to exit back to Normal mode
- **Use Cases**:
  - Enter access codes to unlock areas
  - Complete word puzzles to open gates
  - Fix "corrupted" text to proceed
  - Create bridges by typing keywords
- **Exit**: Press `Esc`

---

## Progression System

### Experience & Leveling

#### XP Sources
- **Level Completion**: Base XP (scales with difficulty)
- **Score Performance**: Bonus XP for high scores
- **Perfect Clears**: Additional XP multiplier
- **Challenges**: Optional objectives for extra XP

#### Level-up Rewards (Persistent)
- **Unlock Vim Motions**: Gain access to new commands permanently
- **Increase Stack Size**: More power-up charges (1 → 2 → 3 → 5)
- **Inventory Slots**: Carry more power-up types simultaneously
- **Cooldown Reduction**: Permanent decrease to cooldown timers
- **Health Increase**: More hits before level failure
- **Theme Unlocks**: New visual themes for map area
- **Cosmetic Unlocks**: Cursor appearances, particle effects

### Persistent vs Temporary Power-ups

#### Persistent (Carry Between Levels)
- **Unlocked Motions**: Once learned, always available
- **Stack Size Upgrades**: Permanently increased capacity
- **Cooldown Reductions**: Permanent improvements
- **Health/Inventory Upgrades**: Always active

#### Temporary (Collected Per Level)
- **Stacked Power-ups**: Must collect from map each level
- **Time Extensions**: Level-specific
- **Shield/Invincibility**: Consumed on use
- **Combo Boosters**: Active for current level only

### Meta-Progression
- **Career Stats**: Total coins collected, levels completed, etc.
- **Leaderboards**: High scores, fastest completions, highest combos
- **Achievements**: Special challenges (speedruns, perfect clears, etc.)
- **Mastery Ranks**: Bronze/Silver/Gold/Platinum for each vim motion

---

## Technical Considerations

### Rendering Strategy (To Be Determined)

#### Option A: HTML Canvas
**Pros**:
- High performance for complex animations and particle effects
- Better for rapid screen updates and visual effects
- More "game-like" feel
- Easier to implement motion blur, trails, distortion effects

**Cons**:
- More complex text rendering (need to handle character grids manually)
- Accessibility considerations (screen readers, etc.)
- Requires manual handling of layering and compositing

#### Option B: DOM Elements
**Pros**:
- Native text rendering (better for monospace alignment)
- Easier accessibility (semantic HTML)
- CSS animations and transitions readily available
- Simpler debugging and inspection

**Cons**:
- Potential performance issues with many elements
- Complex animations may be harder to coordinate
- May feel less "game-like"

#### Option C: Hybrid Approach
**Pros**:
- Canvas for cursor, effects, particles, obstacles
- DOM for map blocks and text elements
- Best of both worlds for performance and readability

**Cons**:
- More complex architecture
- Need to sync two rendering systems
- Potential z-index and layering challenges

**Recommendation**: Prototype with Option B (DOM) for rapid development, then evaluate if Canvas (Option A) or Hybrid (Option C) is needed for performance/effects.

### Language & Tooling Choice

#### Vanilla JavaScript (Recommended Starting Point)
**Pros**:
- Zero build complexity - use ES modules directly in browser
- Fastest iteration speed during prototyping
- Modern JavaScript features sufficient for game logic
- Easy to understand and debug
- No learning curve for TypeScript
- Can add type checking later with JSDoc or migrate to TypeScript

**Cons**:
- No compile-time type safety
- Refactoring requires more manual care
- Runtime errors for type mismatches

**Migration Path**:
- Start with vanilla JS and ES modules
- Use `// @ts-check` in files where type safety would help
- Migrate to TypeScript in later phases if:
  - Getting frequent runtime errors from type issues
  - Refactoring becomes risky
  - State management complexity increases (Phase 4+)
  - Team preference shifts toward typed code

**Philosophy**: Keep things as simple as possible, but not too simple. Add complexity (TypeScript, frameworks) only when justified by actual pain points.

### Input Handling
- **Keyboard Only**: Physical keyboard required (Bluetooth keyboards supported on mobile)
- **Key Binding System**: Map vim motions to keyboard inputs
- **Input Buffer**: Queue rapid inputs for smooth combo execution
- **Mode-specific Handlers**: Different key meanings per mode

### Procedural Generation
- **Algorithm**: Deterministic random generation with seed
- **Constraints**:
  - Ensure solvable paths with available motions
  - Balance coin placement for optimal motion usage
  - Scale obstacle density with difficulty
  - Maintain "document-like" visual structure
- **Testing**: Validate generated maps are completable

### State Management
- **Game State**: Current level, score, time, player position
- **Progression State**: XP, unlocks, persistent upgrades (saved to localStorage)
- **Performance State**: FPS monitoring, optimization flags

### Testing Strategy

#### Two-Tier Approach
The project uses a two-tier testing strategy to balance development velocity with deployment safety:

**Tier 1: Unit Tests (Development Feedback Loop)**
- **Tool**: Vitest (modern, fast, Vite-integrated)
- **Purpose**: Immediate feedback during development
- **When to run**:
  - Watch mode during active development
  - Pre-commit hook (blocks commits if failing)
- **Speed requirement**: < 1 second for full suite in Phase 1
- **Focus areas**:
  - Player movement and collision detection
  - Coin collection and scoring logic
  - Timer countdown and callbacks
  - State transitions and validation
  - Win/lose condition detection
- **Scope**: Game logic only, not rendering or visual effects

**Tier 2: E2E Tests (Deployment Gate)**
- **Tool**: Playwright (modern, reliable, multi-browser)
- **Purpose**: Prevent broken builds from being pushed or deployed
- **When to run**:
  - Pre-push hook (blocks push if failing)
  - CI/CD pipeline (before staging/production deploy)
- **Speed tolerance**: 10-30 seconds acceptable
- **Critical flows (Phase 1)**:
  1. Happy path: Start game → collect all coins → win
  2. Timeout path: Start game → timer expires → lose
  3. Restart flow: Complete level → restart → verify game works
  4. Movement verification: hjkl keys move cursor correctly
- **Expansion**: Add more E2E tests in later phases for new features

#### Type Checking (Optional)
- **jsconfig.json**: Provides IntelliSense and basic IDE support
- **No mandatory type checking**: Keep compilation simple
- **Optional `// @ts-check`**: Add to individual files if desired
- **JSDoc**: Use sparingly for documentation, not type enforcement
- **Migration path**: Convert to TypeScript in later phases if needed

### Save System
- **Auto-save**: Progress saved after each level completion
- **Manual Save**: Available through command mode
- **Storage**: LocalStorage for browser-based saves
- **Cloud Sync**: Optional future feature

---

## Development Phases

### Phase 1: Core Prototype (MVP)
**Goal**: Prove the core gameplay loop is fun

**Features**:
- Basic map generation (simple procedural blocks)
- Character movement: `hjkl` only
- Coin collection mechanic
- Timer and basic scoring
- Minimal visual effects (no motion blur yet)
- Single level that restarts on completion/failure
- DOM-based rendering

**Success Criteria**: Playable, controls feel responsive, core loop is engaging

### Phase 2: Power-up System
**Goal**: Introduce vim motion progression

**Features**:
- Power-up collection and unlocking
- Word movement: `w`, `b`, `e`
- Cooldown system with visual badges
- Stack system for power-ups
- Extended HUD with power-up display
- Tutorial popups
- 5 progressively harder levels

**Success Criteria**: Players learn and use word-based motions, progression feels rewarding

### Phase 3: Visual Polish
**Goal**: Make the game feel juicy and satisfying

**Features**:
- Cursor movement effects (rocket, motion blur, jello)
- Particle effects for collection, hits, combos
- Sound effects for all actions
- Background music (dynamic based on timer)
- Combo system with visual feedback
- Theme system (2-3 themes)
- Evaluate Canvas vs DOM rendering based on performance

**Success Criteria**: Game feels responsive and exciting, visual feedback reinforces actions

### Phase 4: Advanced Mechanics
**Goal**: Introduce complex vim modes and obstacles

**Features**:
- Visual mode (select, yank, delete, paste)
- Insert mode (typing challenges)
- Line jumps: `0`, `$`, `^`
- Paragraph jumps: `{`, `}`
- Stationary and moving obstacles
- Health/damage system
- 15 total levels with difficulty curve

**Success Criteria**: Advanced vim motions are learnable through gameplay, obstacles add challenge

### Phase 5: Progression & Polish
**Goal**: Create long-term engagement

**Features**:
- XP and leveling system
- Persistent unlocks
- Additional themes and cosmetics
- Leaderboards
- Achievements
- Find commands: `f`, `F`, `/`
- Concept obstacles (macro barriers, puzzles)
- 25+ levels
- Final UI polish and menu systems

**Success Criteria**: Players return to game, feel progression over time, mastery is rewarding

### Phase 6: Community & Content
**Goal**: Expand replayability and community engagement

**Features**:
- Daily challenges
- Custom level editor (optional)
- Speedrun mode
- Additional vim motions (macros, marks, etc.)
- Mobile optimization (with Bluetooth keyboard)
- Social features (share scores, replay viewing)

**Success Criteria**: Active player community, high replay value

---

## Success Metrics

### Engagement Metrics
- **Session Length**: Average time per play session
- **Retention**: Players returning after first session (D1, D7, D30)
- **Level Progression**: Percentage of players reaching each level
- **Completion Rate**: Percentage completing vs abandoning levels

### Learning Metrics
- **Motion Adoption**: Percentage of players using each vim motion
- **Efficiency Score**: Ratio of optimal movements to actual movements
- **Mastery Time**: Time to reach proficiency with each motion type

### Satisfaction Metrics
- **Fun Rating**: Player survey responses
- **Net Promoter Score**: Would recommend to others
- **Vim Adoption**: Players reporting using vim after playing game

---

## Open Questions & Future Considerations

### Open Questions
1. **Mobile Strategy**: Focus on desktop first or invest in mobile-friendly UI?
2. **Monetization**: Free with optional cosmetic purchases? One-time purchase? Ads?
3. **Multiplayer**: Competitive racing mode? Cooperative challenges?
4. **Content Pipeline**: How often to add new levels/features post-launch?

### Future Features (Post-MVP)
- **Macros**: Record and replay command sequences
- **Marks**: Set and jump to marked positions
- **Registers**: Multiple clipboard-like storage
- **Window Splits**: Navigate multiple map areas simultaneously
- **Plugin System**: Community-created power-ups and motions
- **Story Mode**: Narrative wrapper around learning vim
- **Boss Battles**: Special levels requiring mastery of specific motions

### Accessibility
- **Colorblind Modes**: Alternative color palettes
- **Reduced Motion**: Option to minimize visual effects
- **Audio Cues**: Enhanced sound feedback for non-visual players
- **Keyboard Shortcuts**: Fully keyboard-accessible menus
- **Tutorial Flexibility**: Skip, replay, or access help anytime

---

## Conclusion

Vim Motions Arcade transforms vim learning from a daunting technical task into an engaging arcade experience. By mapping vim commands to game mechanics, players build muscle memory naturally while having fun. The procedural generation ensures replayability, while the progression system maintains long-term engagement.

**Core Value Proposition**: Master vim motions by playing an addictive game, not by reading documentation.

**Next Steps**: Begin Phase 1 development with core prototype, validate gameplay loop, then iterate based on playtesting feedback.

---

## Appendix: Vim Motion Reference

### Motions Included in Game

| Motion | Command | Description | Phase |
|--------|---------|-------------|-------|
| **Character** | `h`, `j`, `k`, `l` | Move left, down, up, right | 1 |
| **Word Forward** | `w` | Jump to start of next word | 2 |
| **Word Backward** | `b` | Jump to start of previous word | 2 |
| **Word End** | `e` | Jump to end of word | 2 |
| **Line Start** | `0` | Jump to start of line | 4 |
| **Line End** | `$` | Jump to end of line | 4 |
| **First Non-blank** | `^` | Jump to first non-whitespace | 4 |
| **Paragraph Up** | `{` | Jump to previous blank line | 4 |
| **Paragraph Down** | `}` | Jump to next blank line | 4 |
| **Find Forward** | `f{char}` | Find next occurrence of char | 5 |
| **Find Backward** | `F{char}` | Find previous occurrence | 5 |
| **Search** | `/{pattern}` | Search forward | 5 |
| **Visual Mode** | `v` | Enter visual selection | 4 |
| **Yank** | `y` | Copy selected text | 4 |
| **Delete** | `d` | Delete selected text | 4 |
| **Paste** | `p` | Paste text | 4 |
| **Insert** | `i` | Enter insert mode | 4 |

### Future Motions (Post-Launch)
- `gg` / `G` - Jump to top/bottom of document
- `H` / `M` / `L` - Jump to high/middle/low of screen
- `t{char}` / `T{char}` - Jump until character
- `%` - Jump to matching bracket/brace
- `*` / `#` - Search word under cursor
- `n` / `N` - Next/previous search result
- `m{letter}` - Set mark
- `'{letter}` - Jump to mark
- `q{letter}` - Record macro
- `@{letter}` - Replay macro

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-08  
**Status**: Ready for Development