/**
 * MazeLevel - A simple maze level definition for testing
 *
 * Small proof-of-concept maze with walls, coins, and player start position.
 * The player navigates using hjkl vim motion keys.
 */

/**
 * Create a simple maze level
 *
 * Legend:
 *   # = wall
 *   . = empty space
 *   @ = player start
 *   * = coin
 *
 * @returns {Object} Level definition
 */
export function createMazeLevel() {
  // Define the maze layout as ASCII art for easy visualization
  const layout = [
    '############',
    '#@..*..#...#',
    '#.##.#.#.#.#',
    '#....#...#.#',
    '#.####.###.#',
    '#.#........#',
    '#.#.####.#.#',
    '#...*....#*#',
    '############',
  ];

  const width = layout[0].length;
  const height = layout.length;
  const walls = [];
  const coins = [];
  let playerStart = { x: 1, y: 1 };

  // Parse the layout
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < layout[y].length; x++) {
      const char = layout[y][x];

      switch (char) {
        case '#':
          walls.push({ x, y });
          break;
        case '*':
          coins.push({ x, y, value: 10 });
          break;
        case '@':
          playerStart = { x, y };
          break;
        // '.' is empty space, no action needed
      }
    }
  }

  return {
    id: 'maze-prototype-001',
    name: 'Simple Maze',
    description: 'A small maze to test hjkl navigation',

    // Dimensions
    width,
    height,

    // Level elements
    walls,
    coins,
    playerStart,

    // Rules
    rules: {
      allowedMotions: ['h', 'j', 'k', 'l'],
      winCondition: 'all-coins',
    },

    // Metadata
    metadata: {
      author: 'system',
      version: '1.0.0',
      tags: ['prototype', 'maze', 'hjkl-only'],
    },
  };
}

/**
 * Create a slightly larger maze for more exploration
 */
export function createLargerMazeLevel() {
  const layout = [
    '################',
    '#@..*..#...*...#',
    '#.##.#.#.####.##',
    '#....#.......*.#',
    '#.####.###.##.##',
    '#.#....*.#....##',
    '#.#.####.####..#',
    '#......#.....#.#',
    '##.###.####.##.#',
    '#..*...#...*...#',
    '################',
  ];

  const width = layout[0].length;
  const height = layout.length;
  const walls = [];
  const coins = [];
  let playerStart = { x: 1, y: 1 };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < layout[y].length; x++) {
      const char = layout[y][x];

      switch (char) {
        case '#':
          walls.push({ x, y });
          break;
        case '*':
          coins.push({ x, y, value: 10 });
          break;
        case '@':
          playerStart = { x, y };
          break;
      }
    }
  }

  return {
    id: 'maze-larger-001',
    name: 'Larger Maze',
    description: 'A bigger maze with more coins to collect',
    width,
    height,
    walls,
    coins,
    playerStart,
    rules: {
      allowedMotions: ['h', 'j', 'k', 'l'],
      winCondition: 'all-coins',
    },
    metadata: {
      author: 'system',
      version: '1.0.0',
      tags: ['prototype', 'maze', 'hjkl-only'],
    },
  };
}
