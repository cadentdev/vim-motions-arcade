import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CommandMode } from '../../src/input/modes/CommandMode.js';

describe('MenuCommandMode', () => {
  let commandMode;
  let menuContext;
  let mockStartGame;
  let mockContinueGame;
  let mockShowHelp;
  let mockQuitGame;

  beforeEach(() => {
    // Create mock functions for menu actions
    mockStartGame = vi.fn();
    mockContinueGame = vi.fn();
    mockShowHelp = vi.fn();
    mockQuitGame = vi.fn();

    // Create menu context with callbacks
    menuContext = {
      startNewGame: mockStartGame,
      continueGame: mockContinueGame,
      showHelp: mockShowHelp,
      quitGame: mockQuitGame,
      hasSavedGame: vi.fn(() => true),
    };

    // Create custom commands for menu
    const menuCommands = {
      new: {
        execute: () => {
          // Check if there's a saved game
          if (menuContext.hasSavedGame()) {
            return {
              success: true,
              action: 'new',
              requiresConfirmation: true,
              message: 'Delete current game and start over?',
            };
          }
          // No saved game, proceed directly
          return {
            success: true,
            action: 'new',
            message: 'Starting new game...',
          };
        },
        description: 'Start a new game',
      },
      edit: {
        execute: () => {
          if (!menuContext.hasSavedGame()) {
            return {
              success: false,
              error: 'No saved game found',
            };
          }
          return {
            success: true,
            action: 'edit',
            message: 'Loading saved game...',
          };
        },
        description: 'Continue from saved game',
      },
      help: {
        execute: () => ({
          success: true,
          action: 'help',
          message: 'Showing help...',
        }),
        description: 'Show help documentation',
      },
      q: {
        execute: () => ({
          success: true,
          action: 'quit',
          requiresConfirmation: true,
          message: 'Close game?',
        }),
        description: 'Quit the game',
      },
      quit: {
        execute: () => ({
          success: true,
          action: 'quit',
          requiresConfirmation: true,
          message: 'Close game?',
        }),
        description: 'Quit the game (alias for :q)',
      },
    };

    commandMode = new CommandMode(menuContext, menuCommands);
  });

  describe('Menu-specific Commands', () => {
    describe(':new command', () => {
      it('should require confirmation when saved game exists', () => {
        menuContext.hasSavedGame.mockReturnValue(true);
        const result = commandMode.executeCommand('new');
        expect(result.success).toBe(true);
        expect(result.action).toBe('new');
        expect(result.requiresConfirmation).toBe(true);
        expect(result.message).toContain('Delete current game and start over?');
      });

      it('should not require confirmation when no saved game exists', () => {
        menuContext.hasSavedGame.mockReturnValue(false);
        const result = commandMode.executeCommand('new');
        expect(result.success).toBe(true);
        expect(result.action).toBe('new');
        expect(result.requiresConfirmation).toBeUndefined();
        expect(result.message).toContain('Starting new game');
      });

      it('should have :new command registered', () => {
        expect(commandMode.hasCommand('new')).toBe(true);
      });
    });

    describe(':edit command', () => {
      it('should execute :edit command when saved game exists', () => {
        const result = commandMode.executeCommand('edit');
        expect(result.success).toBe(true);
        expect(result.action).toBe('edit');
        expect(result.message).toContain('saved game');
      });

      it('should fail when no saved game exists', () => {
        menuContext.hasSavedGame.mockReturnValue(false);
        const menuCommands = {
          edit: {
            execute: () => {
              if (!menuContext.hasSavedGame()) {
                return {
                  success: false,
                  error: 'No saved game found',
                };
              }
              return {
                success: true,
                action: 'edit',
                message: 'Loading saved game...',
              };
            },
            description: 'Continue from saved game',
          },
        };
        commandMode = new CommandMode(menuContext, menuCommands);

        const result = commandMode.executeCommand('edit');
        expect(result.success).toBe(false);
        expect(result.error).toContain('No saved game');
      });

      it('should have :edit command registered', () => {
        expect(commandMode.hasCommand('edit')).toBe(true);
      });
    });

    describe(':help command', () => {
      it('should execute :help command', () => {
        const result = commandMode.executeCommand('help');
        expect(result.success).toBe(true);
        expect(result.action).toBe('help');
      });

      it('should have :help command registered', () => {
        expect(commandMode.hasCommand('help')).toBe(true);
      });
    });

    describe(':quit command', () => {
      it('should execute :quit command', () => {
        const result = commandMode.executeCommand('quit');
        expect(result.success).toBe(true);
        expect(result.action).toBe('quit');
        expect(result.requiresConfirmation).toBe(true);
      });

      it('should execute :q command (alias)', () => {
        const result = commandMode.executeCommand('q');
        expect(result.success).toBe(true);
        expect(result.action).toBe('quit');
        expect(result.requiresConfirmation).toBe(true);
      });

      it('should have both :q and :quit commands registered', () => {
        expect(commandMode.hasCommand('q')).toBe(true);
        expect(commandMode.hasCommand('quit')).toBe(true);
      });
    });
  });

  describe('Command Execution - Menu Context', () => {
    it('should return error for unknown command', () => {
      const result = commandMode.executeCommand('unknown');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('Unknown command');
    });

    it('should list all menu commands', () => {
      const commands = commandMode.getAvailableCommands();
      expect(commands).toContain('new');
      expect(commands).toContain('edit');
      expect(commands).toContain('help');
      expect(commands).toContain('q');
      expect(commands).toContain('quit');
    });
  });

  describe('Buffer Management - Same as Game Mode', () => {
    it('should build command from key presses', () => {
      commandMode.activate();
      commandMode.addChar('n');
      commandMode.addChar('e');
      commandMode.addChar('w');

      expect(commandMode.getBuffer()).toBe('new');
    });

    it('should handle backspace', () => {
      commandMode.activate();
      commandMode.addChar('e');
      commandMode.addChar('d');
      commandMode.addChar('i');
      commandMode.addChar('t');
      commandMode.backspace();

      expect(commandMode.getBuffer()).toBe('edi');
    });

    it('should clear buffer on submit', () => {
      commandMode.activate();
      commandMode.addChar('n');
      commandMode.addChar('e');
      commandMode.addChar('w');
      commandMode.submit();

      expect(commandMode.getBuffer()).toBe('');
    });

    it('should clear buffer on cancel', () => {
      commandMode.activate();
      commandMode.addChar('q');
      commandMode.cancel();

      expect(commandMode.getBuffer()).toBe('');
      expect(commandMode.isActive).toBe(false);
    });
  });
});
