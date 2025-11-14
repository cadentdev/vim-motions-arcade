# Vim Motions Reference

Complete reference guide for all vim motions available in Vim Motions Arcade. This guide shows which motions are implemented in each phase of development.

---

## 📋 Table of Contents

- [Motion Categories](#motion-categories)
- [Phase 1: Core Motions (MVP)](#phase-1-core-motions-mvp)
- [Phase 2: Word Motions](#phase-2-word-motions)
- [Phase 3: Line Motions](#phase-3-line-motions)
- [Phase 4: Paragraph & Block Motions](#phase-4-paragraph--block-motions)
- [Phase 5: Search & Find Motions](#phase-5-search--find-motions)
- [Phase 6: Advanced Motions](#phase-6-advanced-motions)
- [Command Mode](#command-mode)
- [Visual Mode](#visual-mode)
- [Insert Mode](#insert-mode)
- [Learning Tips](#learning-tips)

---

## 🎯 Motion Categories

Vim motions are organized into categories based on their scope and purpose:

| Category | Scope | Examples |
|----------|-------|----------|
| **Character** | Single character | `h`, `j`, `k`, `l` |
| **Word** | Word boundaries | `w`, `b`, `e`, `ge` |
| **Line** | Within a line | `0`, `$`, `^`, `_` |
| **Paragraph** | Text blocks | `{`, `}` |
| **Search** | Find patterns | `f`, `F`, `t`, `T`, `/`, `?` |
| **Jump** | Large movements | `gg`, `G`, `%` |
| **Visual** | Selection | `v`, `V`, `Ctrl-v` |
| **Edit** | Modify text | `d`, `y`, `c`, `p` |

---

## Phase 1: Core Motions (MVP)

### Character Movement (hjkl)

The foundation of vim navigation. These are the first motions you'll learn.

| Key | Motion | Description | In-Game Effect |
|-----|--------|-------------|----------------|
| `h` | Left | Move cursor one character left | Move player left |
| `j` | Down | Move cursor one line down | Move player down |
| `k` | Up | Move cursor one line up | Move player up |
| `l` | Right | Move cursor one character right | Move player right |

**Why hjkl?**
- Home row keys - no need to move your hands
- `j` looks like a down arrow
- `k` is above `j` (up)
- `h` is leftmost, `l` is rightmost

**Game Mechanics**:
- Available from the start
- No cooldown
- Single character movement
- Foundation for all other motions

---

## Phase 2: Word Motions

Word-based navigation for faster movement. These are power-ups you unlock.

### Forward Word Movement

| Key | Motion | Description | In-Game Effect |
|-----|--------|-------------|----------------|
| `w` | Word | Jump to start of next word | Jump forward to next word boundary |
| `W` | WORD | Jump to start of next WORD (whitespace-separated) | Jump forward, ignoring punctuation |
| `e` | End | Jump to end of current/next word | Jump to word ending |
| `E` | END | Jump to end of current/next WORD | Jump to WORD ending |

### Backward Word Movement

| Key | Motion | Description | In-Game Effect |
|-----|--------|-------------|----------------|
| `b` | Back | Jump to start of previous word | Jump backward to word start |
| `B` | BACK | Jump to start of previous WORD | Jump backward to WORD start |
| `ge` | Go End | Jump to end of previous word | Jump backward to word end |
| `gE` | Go END | Jump to end of previous WORD | Jump backward to WORD end |

**Word vs WORD**:
- **word**: Delimited by punctuation and whitespace (`hello-world` = 3 words)
- **WORD**: Delimited only by whitespace (`hello-world` = 1 WORD)

**Game Mechanics**:
- Unlocked by collecting power-ups
- Short cooldown (2-3 seconds)
- Moves multiple characters at once
- More efficient than hjkl for long distances
- Coins often placed at word boundaries

---

## Phase 3: Line Motions

Navigate within a single line efficiently.

### Line Boundaries

| Key | Motion | Description | In-Game Effect |
|-----|--------|-------------|----------------|
| `0` | Line Start | Jump to first character of line | Jump to line beginning |
| `^` | First Non-blank | Jump to first non-whitespace character | Jump to first word |
| `$` | Line End | Jump to last character of line | Jump to line ending |
| `_` | First Non-blank (alternative) | Same as `^` | Jump to first word |
| `g_` | Last Non-blank | Jump to last non-whitespace character | Jump to last word |

### Line Navigation

| Key | Motion | Description | In-Game Effect |
|-----|--------|-------------|----------------|
| `+` | Next Line | Jump to first non-blank of next line | Jump down one line, align left |
| `-` | Previous Line | Jump to first non-blank of previous line | Jump up one line, align left |
| `_` | Current Line | Jump to first non-blank of current line | Align to line start |

**Game Mechanics**:
- Unlocked in Phase 3
- Medium cooldown (3-4 seconds)
- Instant horizontal movement
- Useful for collecting line-end coins
- Combines well with vertical motions

---

## Phase 4: Paragraph & Block Motions

Navigate by text blocks and structures.

### Paragraph Navigation

| Key | Motion | Description | In-Game Effect |
|-----|--------|-------------|----------------|
| `{` | Paragraph Up | Jump to previous blank line | Jump to previous section |
| `}` | Paragraph Down | Jump to next blank line | Jump to next section |
| `(` | Sentence Back | Jump to previous sentence | Jump backward by sentence |
| `)` | Sentence Forward | Jump to next sentence | Jump forward by sentence |

### Block Navigation

| Key | Motion | Description | In-Game Effect |
|-----|--------|-------------|----------------|
| `%` | Matching Bracket | Jump to matching bracket/paren | Jump between paired obstacles |
| `[[` | Section Backward | Jump to previous section | Large backward jump |
| `]]` | Section Forward | Jump to next section | Large forward jump |
| `[]` | Previous End | Jump to previous section end | Jump to section boundary |
| `][` | Next End | Jump to next section end | Jump to section boundary |

**Game Mechanics**:
- Unlocked in Phase 4
- Long cooldown (5-6 seconds)
- Large movement distances
- Strategic positioning
- Boss levels use these heavily

---

## Phase 5: Search & Find Motions

Find and jump to specific characters or patterns.

### Character Find

| Key | Motion | Description | In-Game Effect |
|-----|--------|-------------|----------------|
| `f{char}` | Find Forward | Jump to next occurrence of {char} | Highlight and jump to character |
| `F{char}` | Find Backward | Jump to previous occurrence of {char} | Highlight and jump backward |
| `t{char}` | Till Forward | Jump before next occurrence of {char} | Jump one before character |
| `T{char}` | Till Backward | Jump after previous occurrence of {char} | Jump one after character |
| `;` | Repeat Find | Repeat last f/F/t/T motion | Repeat last find |
| `,` | Reverse Find | Repeat last f/F/t/T in opposite direction | Reverse last find |

### Pattern Search

| Key | Motion | Description | In-Game Effect |
|-----|--------|-------------|----------------|
| `/{pattern}` | Search Forward | Search for pattern forward | Enter search mode, highlight matches |
| `?{pattern}` | Search Backward | Search for pattern backward | Search backward, highlight matches |
| `n` | Next Match | Jump to next search match | Jump to next highlighted match |
| `N` | Previous Match | Jump to previous search match | Jump to previous match |
| `*` | Search Word | Search for word under cursor | Auto-search current word |
| `#` | Search Word Back | Search for word under cursor backward | Auto-search backward |

**Game Mechanics**:
- Unlocked in Phase 5
- Variable cooldown based on distance
- Requires target input (character or pattern)
- High skill ceiling
- Speedrun essential
- Combo potential with other motions

---

## Phase 6: Advanced Motions

Expert-level motions for maximum efficiency.

### Document Navigation

| Key | Motion | Description | In-Game Effect |
|-----|--------|-------------|----------------|
| `gg` | File Start | Jump to first line | Jump to level start |
| `G` | File End | Jump to last line | Jump to level end |
| `{n}G` | Line Number | Jump to line {n} | Jump to specific line |
| `{n}gg` | Line Number | Jump to line {n} (alternative) | Jump to specific line |
| `H` | Screen Top | Jump to top of screen | Jump to viewport top |
| `M` | Screen Middle | Jump to middle of screen | Jump to viewport middle |
| `L` | Screen Bottom | Jump to bottom of screen | Jump to viewport bottom |

### Marks & Jumps

| Key | Motion | Description | In-Game Effect |
|-----|--------|-------------|----------------|
| `m{a-z}` | Set Mark | Set mark at current position | Place checkpoint |
| `'{a-z}` | Jump to Mark | Jump to mark (line) | Jump to checkpoint |
| `` `{a-z} `` | Jump to Mark | Jump to mark (exact position) | Jump to exact checkpoint |
| `''` | Previous Position | Jump to previous position (line) | Undo last jump |
| ``` `` ``` | Previous Position | Jump to previous position (exact) | Undo last jump (exact) |
| `Ctrl-o` | Jump Backward | Go back in jump list | Navigate jump history back |
| `Ctrl-i` | Jump Forward | Go forward in jump list | Navigate jump history forward |

### Scroll Motions

| Key | Motion | Description | In-Game Effect |
|-----|--------|-------------|----------------|
| `Ctrl-f` | Page Down | Scroll down one page | Move viewport down |
| `Ctrl-b` | Page Up | Scroll up one page | Move viewport up |
| `Ctrl-d` | Half Page Down | Scroll down half page | Move viewport down (half) |
| `Ctrl-u` | Half Page Up | Scroll up half page | Move viewport up (half) |
| `Ctrl-e` | Scroll Down | Scroll down one line | Scroll viewport down |
| `Ctrl-y` | Scroll Up | Scroll up one line | Scroll viewport up |
| `zt` | Top | Scroll current line to top | Center on player (top) |
| `zz` | Center | Scroll current line to center | Center on player (middle) |
| `zb` | Bottom | Scroll current line to bottom | Center on player (bottom) |

**Game Mechanics**:
- Unlocked in Phase 6
- Powerful but complex
- Requires strategic planning
- Essential for speedruns
- Used in challenge modes

---

## Command Mode

Enter command mode with `:` to execute commands.

### Basic Commands

| Command | Description | In-Game Effect |
|---------|-------------|----------------|
| `:q` | Quit | Return to main menu |
| `:quit` | Quit (long form) | Return to main menu |
| `:w` | Write/Save | Save game progress |
| `:wq` | Write and Quit | Save and return to menu |
| `:q!` | Quit Force | Quit without saving |
| `:help` | Help | Show command reference |
| `:help {topic}` | Help Topic | Show help for specific topic |

### Game Commands

| Command | Description | In-Game Effect |
|---------|-------------|----------------|
| `:pause` | Pause Game | Pause timer and gameplay |
| `:resume` | Resume Game | Resume from pause |
| `:restart` | Restart Level | Restart current level |
| `:skip` | Skip Tutorial | Skip tutorial level |
| `:theme {name}` | Change Theme | Switch visual theme |
| `:stats` | Show Stats | Display game statistics |
| `:leaderboard` | Leaderboard | Show high scores |

**Tutorial Level 0**: "How to Quit Vim"
- First level teaches `:q` command
- Must type `:q` and press Enter to complete
- Classic vim joke turned into gameplay

---

## Visual Mode

Select text for operations (Phase 4+).

### Visual Mode Types

| Key | Mode | Description | In-Game Effect |
|-----|------|-------------|----------------|
| `v` | Visual | Character-wise selection | Select individual characters |
| `V` | Visual Line | Line-wise selection | Select entire lines |
| `Ctrl-v` | Visual Block | Block-wise selection | Select rectangular blocks |

### Visual Mode Operations

| Key | Operation | Description | In-Game Effect |
|-----|-----------|-------------|----------------|
| `y` | Yank | Copy selection | Copy coins/power-ups |
| `d` | Delete | Delete selection | Remove obstacles |
| `c` | Change | Delete and enter insert mode | Transform blocks |
| `p` | Paste | Paste after cursor | Place copied items |
| `P` | Paste Before | Paste before cursor | Place copied items before |
| `>` | Indent | Indent selection | Shift blocks right |
| `<` | Dedent | Dedent selection | Shift blocks left |

**Game Mechanics**:
- Unlocked in Phase 4
- Enter visual mode, move to select
- Perform operation on selection
- Advanced puzzle mechanics
- Required for some levels

---

## Insert Mode

Edit text directly (Phase 4+).

### Enter Insert Mode

| Key | Mode | Description | In-Game Effect |
|-----|------|-------------|----------------|
| `i` | Insert | Insert before cursor | Enter edit mode |
| `I` | Insert Line Start | Insert at line start | Edit from line start |
| `a` | Append | Insert after cursor | Edit after cursor |
| `A` | Append Line End | Insert at line end | Edit from line end |
| `o` | Open Below | Open new line below | Create new line below |
| `O` | Open Above | Open new line above | Create new line above |

### Exit Insert Mode

| Key | Action | Description |
|-----|--------|-------------|
| `Esc` | Exit | Return to normal mode |
| `Ctrl-[` | Exit | Return to normal mode (alternative) |
| `Ctrl-c` | Exit | Return to normal mode (alternative) |

**Game Mechanics**:
- Unlocked in Phase 4
- Special "typing" challenges
- Create platforms or bridges
- Puzzle-solving mechanics
- Timed typing challenges

---

## 🎓 Learning Tips

### Progression Path

1. **Phase 1**: Master `hjkl` - Build muscle memory
2. **Phase 2**: Learn `w`, `b`, `e` - Speed up navigation
3. **Phase 3**: Add `0`, `$`, `^` - Horizontal efficiency
4. **Phase 4**: Practice `{`, `}` - Vertical jumps
5. **Phase 5**: Master `f`, `t`, `/` - Precision movement
6. **Phase 6**: Combine everything - Expert level

### Practice Strategies

- **Repetition**: Play levels multiple times
- **Combos**: Chain motions together (e.g., `3w` = 3 words forward)
- **Efficiency**: Find the shortest path to collect all coins
- **Speedruns**: Race against the clock
- **Challenges**: Complete levels with specific motion restrictions

### Common Patterns

| Pattern | Motions | Use Case |
|---------|---------|----------|
| Line sweep | `0`, `$`, `j` | Collect all coins on consecutive lines |
| Word hop | `w`, `w`, `w` | Jump across multiple words |
| Paragraph skip | `}`, `}` | Skip large sections quickly |
| Search & collect | `/coin`, `n`, `n` | Find all instances of something |
| Visual select | `v`, `3w`, `y` | Copy multiple words |

### Vim in Real Life

These motions work in actual vim and vim-mode plugins:
- **VS Code**: Vim extension
- **IntelliJ**: IdeaVim plugin
- **Sublime Text**: Vintage mode
- **Browsers**: Vimium extension
- **Terminal**: Vim, Neovim

---

## 📊 Motion Cheat Sheet

### Quick Reference

```
Character:  h j k l
Word:       w b e ge W B E gE
Line:       0 $ ^ _ g_
Paragraph:  { } ( )
Find:       f F t T ; ,
Search:     / ? n N * #
Jump:       gg G H M L
Command:    : (then type command)
Visual:     v V Ctrl-v
Insert:     i I a A o O
```

### Counting

Prefix any motion with a number to repeat it:
- `3w` = Move forward 3 words
- `5j` = Move down 5 lines
- `2{` = Move up 2 paragraphs
- `10l` = Move right 10 characters

### Combining Motions

Motions can be combined with operators:
- `d3w` = Delete 3 words
- `y$` = Yank to end of line
- `c}` = Change to end of paragraph
- `>3j` = Indent 3 lines down

---

## 🎮 In-Game Motion Unlocks

| Phase | Motions Unlocked | Levels |
|-------|------------------|--------|
| **Phase 1** | `hjkl`, `:q`, `:help` | 1-5 |
| **Phase 2** | `w`, `b`, `e`, `W`, `B`, `E` | 6-10 |
| **Phase 3** | `0`, `$`, `^`, `_`, `g_` | 11-15 |
| **Phase 4** | `{`, `}`, `(`, `)`, `%`, `v`, `V` | 16-20 |
| **Phase 5** | `f`, `F`, `t`, `T`, `/`, `?`, `n`, `N` | 21-25 |
| **Phase 6** | `gg`, `G`, `H`, `M`, `L`, marks, jumps | 26-30+ |

---

## 📚 Additional Resources

### Learn Vim

- **[Vim Documentation](https://www.vim.org/docs.php)**: Official vim docs
- **[OpenVim](https://www.openvim.com/)**: Interactive vim tutorial
- **[Vim Adventures](https://vim-adventures.com/)**: Another vim game
- **[Practical Vim](https://pragprog.com/titles/dnvim2/practical-vim-second-edition/)**: Excellent book

### Vim Cheat Sheets

- **[Vim Cheat Sheet](https://vim.rtorr.com/)**: Comprehensive reference
- **[Graphical Vim Cheat Sheet](http://www.viemu.com/a_vi_vim_graphical_cheat_sheet_tutorial.html)**: Visual guide

---

**Master these motions in the game, master them in vim! 🎮⌨️**
