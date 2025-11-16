# Contributing to Vim Motions Arcade

Thank you for your interest in contributing to Vim Motions Arcade! We welcome contributions from developers of all skill levels. Whether you're fixing bugs, adding features, improving documentation, or designing levels, your help makes this project better.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Contribution Ideas](#contribution-ideas)
- [Questions?](#questions)

---

## 🤝 Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow:

- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome newcomers and diverse perspectives
- **Be collaborative**: Work together and help each other
- **Be constructive**: Provide helpful feedback and criticism
- **Be patient**: Remember that everyone is learning

Unacceptable behavior will not be tolerated. Please report any issues to hello@cadent.net.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git
- A modern web browser
- A code editor (VS Code recommended)

### Initial Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**:

   ```bash
   git clone https://github.com/YOUR_USERNAME/vim-motions-arcade.git
   cd vim-motions-arcade
   ```

3. **Add upstream remote**:

   ```bash
   git remote add upstream https://github.com/cadentdev/vim-motions-arcade.git
   ```

4. **Install dependencies**:

   ```bash
   npm install
   ```

5. **Start the dev server**:

   ```bash
   npm run dev
   ```

6. **Run tests**:
   ```bash
   npm test
   ```

---

## 🔄 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
# or
git checkout -b docs/documentation-update
```

Branch naming conventions:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications
- `chore/` - Maintenance tasks

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed
- Test your changes thoroughly

### 3. Keep Your Branch Updated

Regularly sync with the upstream repository:

```bash
git fetch upstream
git rebase upstream/main
```

### 4. Commit Your Changes

Follow our [commit guidelines](#commit-guidelines):

```bash
git add .
git commit -m "feat: add word movement power-up"
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Open a Pull Request

Go to GitHub and open a pull request from your branch to the main repository.

---

## 📝 Coding Standards

### JavaScript Style Guide

We use ESLint and Prettier to enforce code style. Run before committing:

```bash
npm run lint
npm run format
```

**Key conventions**:

- Use ES6+ features (const/let, arrow functions, destructuring)
- Use camelCase for variables and functions
- Use PascalCase for classes
- Use UPPER_SNAKE_CASE for constants
- Prefer `const` over `let`, avoid `var`
- Use template literals for string interpolation
- Add JSDoc comments for public APIs

**Example**:

```javascript
/**
 * Calculates the score bonus for collecting all coins
 * @param {number} timeRemaining - Seconds remaining on timer
 * @param {number} coinsCollected - Total coins collected
 * @returns {number} Bonus score
 */
function calculateBonus(timeRemaining, coinsCollected) {
  const TIME_MULTIPLIER = 10;
  const COIN_MULTIPLIER = 5;
  return timeRemaining * TIME_MULTIPLIER + coinsCollected * COIN_MULTIPLIER;
}
```

### File Organization

```
src/
├── core/           # Core game engine
│   ├── GameLoop.js
│   ├── StateManager.js
│   └── EventBus.js
├── entities/       # Game entities
│   ├── Player.js
│   ├── Coin.js
│   └── PowerUp.js
├── systems/        # Game systems
│   ├── InputSystem.js
│   ├── CollisionSystem.js
│   └── RenderSystem.js
├── ui/             # UI components
│   ├── HUD.js
│   ├── Menu.js
│   └── Modal.js
└── utils/          # Utility functions
    ├── math.js
    └── helpers.js
```

### CSS Guidelines

- Use CSS custom properties for theming
- Follow BEM naming convention for classes
- Keep selectors simple and performant
- Use flexbox/grid for layouts
- Mobile-first responsive design

---

## 🧪 Testing Guidelines

### Unit Tests

Write unit tests for all game logic using Vitest:

```javascript
import { describe, it, expect } from 'vitest';
import { calculateBonus } from '../src/utils/scoring.js';

describe('calculateBonus', () => {
  it('should calculate correct bonus for time and coins', () => {
    const bonus = calculateBonus(30, 10);
    expect(bonus).toBe(350); // (30 * 10) + (10 * 5)
  });

  it('should return 0 when no time or coins', () => {
    const bonus = calculateBonus(0, 0);
    expect(bonus).toBe(0);
  });
});
```

Run unit tests:

```bash
npm test              # Run once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

### E2E Tests

Write E2E tests for critical user flows using Playwright:

```javascript
import { test, expect } from '@playwright/test';

test('player can collect coins and win level', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Start game
  await page.click('button:has-text("Start New Game")');

  // Collect coins using hjkl keys
  await page.keyboard.press('l');
  await page.keyboard.press('j');

  // Verify score increased
  const score = await page.textContent('.score');
  expect(parseInt(score)).toBeGreaterThan(0);
});
```

Run E2E tests:

```bash
npm run test:e2e              # Run all E2E tests
npm run test:e2e:headed       # Run with browser visible
npm run test:e2e:debug        # Debug mode
```

### Test Coverage

Aim for:

- **80%+ coverage** for core game logic
- **100% coverage** for critical systems (scoring, collision, state management)
- **E2E tests** for all major user flows

---

## 💬 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples

```bash
feat(player): add diagonal movement with hjkl combinations

fix(collision): prevent player from moving through obstacles

docs(readme): update installation instructions

test(scoring): add tests for combo multiplier system

refactor(rendering): extract DOM manipulation to separate module
```

### Rules

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor" not "moves cursor")
- Keep subject line under 72 characters
- Reference issues in footer: `Fixes #123` or `Closes #456`

---

## 🔀 Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass (`npm test`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] Linter passes (`npm run lint`)
- [ ] Documentation is updated
- [ ] Commit messages follow guidelines
- [ ] Branch is up to date with main

### PR Template

When opening a PR, include:

**Description**

- What does this PR do?
- Why is this change needed?

**Type of Change**

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

**Testing**

- How was this tested?
- What test cases were added?

**Screenshots** (if applicable)

- Before/after screenshots for UI changes

**Related Issues**

- Fixes #123
- Related to #456

### Review Process

1. **Automated checks** must pass (linting, tests, build)
2. **Code review** by at least one maintainer
3. **Testing** by reviewer if needed
4. **Approval** and merge by maintainer

### After Merge

- Delete your branch
- Update your local repository:
  ```bash
  git checkout main
  git pull upstream main
  ```

---

## 💡 Contribution Ideas

### 🐛 Bug Fixes

Check the [Issues](../../issues) page for bugs labeled `bug` or `good first issue`.

### ✨ Features

Implement features from the [Roadmap](./docs/ROADMAP.md):

- New vim motions
- Power-up systems
- Visual effects
- Sound effects
- Level generation improvements

### 📝 Documentation

- Improve README
- Add code comments
- Write tutorials
- Create video guides
- Translate documentation

### 🎨 Design

- Create new themes
- Design UI components
- Create animations
- Design level layouts
- Create promotional graphics

### 🎵 Audio

- Compose background music
- Create sound effects
- Design audio feedback systems

### 🧪 Testing

- Write unit tests
- Write E2E tests
- Manual QA testing
- Performance testing
- Accessibility testing

### 🌐 Localization

- Translate UI text
- Localize documentation
- Add language support

---

## ❓ Questions?

### Getting Help

- **Documentation**: Check the [docs](./docs/) folder
- **Issues**: Search [existing issues](../../issues)
- **Discussions**: Join [GitHub Discussions](../../discussions)
- **Email**: hello@cadent.net

### Reporting Bugs

Use the bug report template and include:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos if applicable
- Browser and OS information
- Console errors

### Suggesting Features

Use the feature request template and include:

- Clear description of the feature
- Use case and motivation
- Proposed implementation (if any)
- Mockups or examples (if applicable)

---

## 🙏 Thank You!

Every contribution, no matter how small, makes a difference. Thank you for helping make Vim Motions Arcade better!

---

**Happy coding! 🎮⌨️**
