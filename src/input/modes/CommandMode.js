/**
 * CommandMode - Handles vim command mode (:q, :quit, :help, etc.)
 */
export class CommandMode {
  constructor(context, customCommands = null) {
    this.context = context;
    this.isActive = false;
    this.buffer = '';

    // Register available commands
    if (customCommands) {
      // Use custom commands (for menu mode)
      this.commands = customCommands;
    } else {
      // Use default game commands (for backward compatibility)
      this.gameState = context; // Keep gameState reference for backward compatibility
      this.commands = {
        q: {
          execute: () => this._quitCommand(),
          description: 'quit to main menu',
        },
        quit: {
          execute: () => this._quitCommand(),
          description: 'Quit to main menu (alias for :q)',
        },
        help: {
          execute: (args) => this._helpCommand(args),
          description: 'Show help for available commands',
        },
      };
    }
  }

  /**
   * Try to activate command mode with a key
   * @param {string} key - The pressed key
   * @returns {boolean} True if command mode was activated
   */
  tryActivate(key) {
    if (key === ':') {
      this.activate();
      return true;
    }
    return false;
  }

  /**
   * Activate command mode
   */
  activate() {
    this.isActive = true;
    this.buffer = '';
  }

  /**
   * Deactivate command mode
   */
  deactivate() {
    this.isActive = false;
    this.buffer = '';
  }

  /**
   * Parse a command string into command and args
   * @param {string} input - The command input
   * @returns {Object} { command, args }
   */
  parseCommand(input) {
    const trimmed = input.trim();

    if (!trimmed) {
      return { command: '', args: [] };
    }

    const parts = trimmed.split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    return { command, args };
  }

  /**
   * Execute a command
   * @param {string} input - The command input
   * @returns {Object} Result object with success, action, message, or error
   */
  executeCommand(input) {
    const { command, args } = this.parseCommand(input);

    if (!command) {
      return { success: false, error: 'No command entered' };
    }

    const commandObj = this.commands[command];

    if (!commandObj) {
      return {
        success: false,
        error: `Unknown command: ${command}. Type :help for available commands.`,
      };
    }

    try {
      return commandObj.execute(args);
    } catch (error) {
      return {
        success: false,
        error: `Command failed: ${error.message}`,
      };
    }
  }

  /**
   * Add a character to the command buffer
   * @param {string} char - The character to add
   */
  addChar(char) {
    this.buffer += char;
  }

  /**
   * Remove the last character from the buffer (backspace)
   */
  backspace() {
    this.buffer = this.buffer.slice(0, -1);
  }

  /**
   * Get the current command buffer
   * @returns {string} The current buffer
   */
  getBuffer() {
    return this.buffer;
  }

  /**
   * Submit the current command (Enter key)
   * @returns {Object} The result of executing the command
   */
  submit() {
    const result = this.executeCommand(this.buffer);
    this.buffer = '';
    return result;
  }

  /**
   * Cancel command mode (Escape key)
   */
  cancel() {
    this.buffer = '';
    this.deactivate();
  }

  /**
   * Check if a command exists
   * @param {string} commandName - The command name
   * @returns {boolean} True if command exists
   */
  hasCommand(commandName) {
    return Object.prototype.hasOwnProperty.call(this.commands, commandName);
  }

  /**
   * Get list of available commands
   * @returns {Array<string>} Array of command names
   */
  getAvailableCommands() {
    return Object.keys(this.commands);
  }

  /**
   * Execute quit command
   * @private
   * @returns {Object} Result object
   */
  _quitCommand() {
    return {
      success: true,
      action: 'quit',
      message: 'Returning to main menu...',
    };
  }

  /**
   * Execute help command
   * @private
   * @param {Array<string>} args - Command arguments
   * @returns {Object} Result object
   */
  _helpCommand(args) {
    // If specific command requested
    if (args.length > 0) {
      const commandName = args[0];
      const command = this.commands[commandName];

      if (!command) {
        return {
          success: false,
          error: `Unknown command: ${commandName}`,
        };
      }

      return {
        success: true,
        message: `:${commandName} - ${command.description}`,
      };
    }

    // General help - list all commands
    const commandList = Object.entries(this.commands)
      .map(([name, cmd]) => `  :${name} - ${cmd.description}`)
      .join('\n');

    return {
      success: true,
      message: `Available commands:\n${commandList}`,
    };
  }
}
