/**
 * VersionDisplay - Renders the version number on the Main Menu
 */

// Version number (hardcoded as per requirements)
const VERSION = '0.1.0';

/**
 * Renders the version display on the main menu
 * @param {HTMLElement} container - The main menu container element
 */
export function renderVersion(container) {
  // Check if version element already exists
  let versionElement = container.querySelector('.version-display');

  if (!versionElement) {
    // Create the version element
    versionElement = document.createElement('div');
    versionElement.className = 'version-display';
    versionElement.textContent = `v${VERSION}`;

    // Append to the container
    container.appendChild(versionElement);
  } else {
    // Update existing element
    versionElement.textContent = `v${VERSION}`;
  }
}

/**
 * Get the current version string
 * @returns {string} The version string (e.g., "v0.1.0")
 */
export function getVersion() {
  return `v${VERSION}`;
}
