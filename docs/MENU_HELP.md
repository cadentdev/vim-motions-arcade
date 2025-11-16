# Vim Motions Arcade - Main Menu Help

## Navigation (NORMAL Mode)

- `j` - Move down to next menu item
- `k` - Move up to previous menu item
- `Enter` - Activate selected menu item
- `:` - Enter COMMAND mode

## Commands (COMMAND Mode)

### Game Commands

- `:new` - Start a new game
- `:edit` - Continue from saved game (if available)

### Help Commands

- `:help` - Display this help text

### System Commands

- `:quit` or `:q` - Close the game (requires confirmation)

## Modes

### NORMAL Mode

The default mode when viewing the menu. Use `j` and `k` keys to navigate between menu options, and press `Enter` to activate the selected option.

### COMMAND Mode

Activated by pressing `:` from NORMAL mode. Type commands and press `Enter` to execute them, or press `Escape` to cancel and return to NORMAL mode.

## Tips

- Command mode works just like Vim - start typing after the `:` prompt
- Invalid commands will show an error message on the status line
- Press `Escape` at any time in COMMAND mode to return to NORMAL mode
- The current mode is always displayed in the status bar at the bottom of the screen
