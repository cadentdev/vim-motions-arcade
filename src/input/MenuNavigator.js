/**
 * MenuNavigator
 * Handles vim-style navigation (j/k keys) for menu screens
 */

export class MenuNavigator {
  constructor(buttons, callbacks = {}) {
    this.buttons = buttons;
    this.callbacks = callbacks;
    this.currentIndex = 0;
    this.isEnabled = false;
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
  }

  /**
   * Enable keyboard navigation
   */
  enable() {
    if (this.isEnabled) return;

    this.isEnabled = true;
    document.addEventListener('keydown', this.boundHandleKeyDown);

    // Set initial focus to first enabled button
    this.setFocus(0);
  }

  /**
   * Disable keyboard navigation
   */
  disable() {
    if (!this.isEnabled) return;

    this.isEnabled = false;
    document.removeEventListener('keydown', this.boundHandleKeyDown);

    // Remove all visual feedback classes
    this.buttons.forEach((button) => {
      button.classList.remove('focused');
      button.classList.remove('active');
    });
  }

  /**
   * Handle keyboard events
   */
  handleKeyDown(event) {
    if (!this.isEnabled) return;

    const { key } = event;

    // Handle navigation keys
    if (key === 'j' || key === 'k') {
      event.preventDefault();

      if (key === 'j') {
        this.moveDown();
      } else if (key === 'k') {
        this.moveUp();
      }
    }
    // Handle Enter key activation
    else if (key === 'Enter') {
      event.preventDefault();
      this.activate();
    }
  }

  /**
   * Move focus down (j key)
   */
  moveDown() {
    // Find next enabled button
    for (let i = this.currentIndex + 1; i < this.buttons.length; i++) {
      if (!this.buttons[i].disabled) {
        this.setFocus(i);
        return;
      }
    }
    // No enabled button found below current
  }

  /**
   * Move focus up (k key)
   */
  moveUp() {
    // Find previous enabled button
    for (let i = this.currentIndex - 1; i >= 0; i--) {
      if (!this.buttons[i].disabled) {
        this.setFocus(i);
        return;
      }
    }
    // No enabled button found above current
  }

  /**
   * Set focus to a specific button index
   */
  setFocus(index) {
    if (index < 0 || index >= this.buttons.length) return;

    // Remove focused class from all buttons
    this.buttons.forEach((button) => button.classList.remove('focused'));

    // Add focused class to current button
    this.buttons[index].classList.add('focused');

    this.currentIndex = index;
  }

  /**
   * Activate the currently focused button
   */
  activate() {
    const currentButton = this.buttons[this.currentIndex];
    if (currentButton && !currentButton.disabled && this.callbacks.onActivate) {
      // Add active class for visual feedback
      currentButton.classList.add('active');

      // Remove active class after a short delay
      setTimeout(() => {
        currentButton.classList.remove('active');
      }, 150);

      this.callbacks.onActivate(currentButton);
    }
  }
}
