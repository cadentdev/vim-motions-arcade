# Testing Guide

This document explains how to run tests locally and in CI/CD for the Vim Motions Arcade project.

## Table of Contents

- [Test Types](#test-types)
- [Running Tests Locally](#running-tests-locally)
- [CI/CD Pipeline](#cicd-pipeline)
- [Troubleshooting](#troubleshooting)

## Test Types

### Unit Tests

- **Framework**: Vitest
- **Location**: `tests/unit/`
- **Purpose**: Test individual components and game logic in isolation
- **Coverage**: 20+ test files covering all core game systems

### E2E Tests

- **Framework**: Playwright
- **Location**: `tests/e2e/`
- **Purpose**: Test complete user flows and interactions
- **Coverage**: 16 tests covering all critical user journeys

## Running Tests Locally

### Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers (for E2E tests)
npx playwright install --with-deps chromium
```

### Unit Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode (great for development)
npm run test:ui

# Run tests once (no watch mode)
npm run test:run

# Generate coverage report
npm run test:coverage
```

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI (interactive mode)
npm run test:e2e:ui

# View last test report
npm run test:e2e:report
```

### Linting and Formatting

```bash
# Run linter
npm run lint

# Check code formatting
npm run format:check

# Auto-fix formatting
npm run format
```

## CI/CD Pipeline

### GitHub Actions Workflow

The project uses GitHub Actions for continuous integration. The workflow is defined in `.github/workflows/ci.yml`.

**Workflow Jobs:**

1. **Lint** - Checks code quality and formatting
2. **Unit Tests** - Runs all unit tests with coverage
3. **E2E Tests** - Runs end-to-end tests in a proper browser environment
4. **Build** - Verifies the project builds successfully

**Trigger Events:**

- Push to `main` branch
- Pull requests targeting `main` branch

### Pre-commit Hook

Automatically runs before each commit:

- Lints and formats staged files
- Runs unit tests

### Pre-push Hook

Automatically runs before each push:

- Runs all E2E tests
- **Blocks push if E2E tests fail**
- Can be bypassed with `git push --no-verify` (not recommended)

## Troubleshooting

### E2E Tests Fail Locally

**Issue**: E2E tests crash with "Page crashed" error

**Solution**: Ensure Playwright browsers are installed with system dependencies:

```bash
npx playwright install --with-deps chromium
```

**Note**: In some containerized environments, Chromium may not work properly. The tests will always run in GitHub Actions CI where the environment is properly configured.

### Pre-push Hook Blocks Push

If E2E tests fail and block your push:

1. **Fix the tests** (recommended):

   ```bash
   npm run test:e2e
   # Fix any failing tests
   git add .
   git commit -m "Fix E2E tests"
   git push
   ```

2. **Skip the hook** (use sparingly):
   ```bash
   git push --no-verify
   ```

### Husky Deprecation Warning

If you see warnings about deprecated Husky syntax, this is expected and will be addressed in a future Husky update. The hooks still work correctly.

## Test Coverage Goals

### Phase 1 (Current)

- ✅ Unit test coverage for all core game systems
- ✅ E2E tests for all critical user flows
- ✅ Pre-commit hooks for code quality
- ✅ Pre-push hooks for deployment safety
- ✅ CI/CD pipeline for automated testing

### Future Phases

- Visual regression testing
- Performance testing
- Accessibility testing
- Cross-browser E2E testing (Firefox, Safari, Edge)

## Writing New Tests

### Unit Test Template

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { YourModule } from '../src/your-module.js';

describe('YourModule', () => {
  let instance;

  beforeEach(() => {
    instance = new YourModule();
  });

  it('should do something', () => {
    const result = instance.doSomething();
    expect(result).toBe(expectedValue);
  });
});
```

### E2E Test Template

```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should complete user flow', async ({ page }) => {
    await page.goto('/');

    // Interact with the page
    await page.click('#some-button');

    // Assert expected outcome
    await expect(page.locator('#result')).toBeVisible();
  });
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Husky Documentation](https://typicode.github.io/husky/)
