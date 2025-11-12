import { describe, it, expect, beforeEach } from 'vitest';
import { CommandMode } from '../../src/input/modes/CommandMode.js';

describe('CommandMode', () => {
  let commandMode;
  let gameState;

  beforeEach(() => {
    gameState = {
      player: { mode: 'normal' },
      isGameOver: false,
    };
    commandMode = new CommandMode(gameState);
  });

  describe('Activation', () => {
    it('should activate when : key is pressed', () => {
      const activated = commandMode.tryActivate(':');
      expect(activated).toBe(true);
    });

    it('should not activate for other keys', () => {
      const activated = commandMode.tryActivate('h');
      expect(activated).toBe(false);
    });

    it('should set mode to command when activated', () => {
      commandMode.activate();
      expect(commandMode.isActive).toBe(true);
    });
  });

  describe('Command Parsing', () => {
    it('should parse simple commands', () => {
      const parsed = commandMode.parseCommand('q');
      expect(parsed.command).toBe('q');
      expect(parsed.args).toEqual([]);
    });

    it('should parse commands with arguments', () => {
      const parsed = commandMode.parseCommand('help movement');
      expect(parsed.command).toBe('help');
      expect(parsed.args).toEqual(['movement']);
    });

    it('should handle empty input', () => {
      const parsed = commandMode.parseCommand('');
      expect(parsed.command).toBe('');
      expect(parsed.args).toEqual([]);
    });

    it('should trim whitespace', () => {
      const parsed = commandMode.parseCommand('  quit  ');
      expect(parsed.command).toBe('quit');
    });
  });

  describe('Command Execution', () => {
    it('should execute :q command', () => {
      const result = commandMode.executeCommand('q');
      expect(result.success).toBe(true);
      expect(result.action).toBe('quit');
    });

    it('should execute :quit command (alias for :q)', () => {
      const result = commandMode.executeCommand('quit');
      expect(result.success).toBe(true);
      expect(result.action).toBe('quit');
    });

    it('should execute :help command', () => {
      const result = commandMode.executeCommand('help');
      expect(result.success).toBe(true);
      expect(result.message).toBeDefined();
    });

    it('should return error for unknown command', () => {
      const result = commandMode.executeCommand('unknown');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Command Input Buffer', () => {
    it('should build command from key presses', () => {
      commandMode.activate();
      commandMode.addChar('h');
      commandMode.addChar('e');
      commandMode.addChar('l');
      commandMode.addChar('p');

      expect(commandMode.getBuffer()).toBe('help');
    });

    it('should handle backspace', () => {
      commandMode.activate();
      commandMode.addChar('h');
      commandMode.addChar('e');
      commandMode.addChar('l');
      commandMode.backspace();

      expect(commandMode.getBuffer()).toBe('he');
    });

    it('should clear buffer on Enter', () => {
      commandMode.activate();
      commandMode.addChar('h');
      commandMode.addChar('e');
      commandMode.submit();

      expect(commandMode.getBuffer()).toBe('');
    });

    it('should clear buffer on Escape', () => {
      commandMode.activate();
      commandMode.addChar('q');
      commandMode.cancel();

      expect(commandMode.getBuffer()).toBe('');
      expect(commandMode.isActive).toBe(false);
    });
  });

  describe('Available Commands', () => {
    it('should have :q command registered', () => {
      expect(commandMode.hasCommand('q')).toBe(true);
    });

    it('should have :quit command registered', () => {
      expect(commandMode.hasCommand('quit')).toBe(true);
    });

    it('should have :help command registered', () => {
      expect(commandMode.hasCommand('help')).toBe(true);
    });

    it('should list all available commands', () => {
      const commands = commandMode.getAvailableCommands();
      expect(commands).toContain('q');
      expect(commands).toContain('quit');
      expect(commands).toContain('help');
    });
  });

  describe('Help Command', () => {
    it('should provide general help when no args', () => {
      const result = commandMode.executeCommand('help');
      expect(result.message).toContain('Available commands');
    });

    it('should provide specific help for a command', () => {
      const result = commandMode.executeCommand('help q');
      expect(result.message).toContain('quit');
    });
  });
});
