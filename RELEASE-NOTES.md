# Release Notes

## Version 0.1.0 - November 15, 2025

**Initial MVP Release** 🎮

This release marks the completion of Phase 1 development, delivering a fully functional Vim motions learning game with comprehensive testing and CI/CD infrastructure.

### Features

#### Core Game Mechanics

- **Vim Motion Controls**: Complete implementation of h/j/k/l navigation with visual feedback
- **Command Mode**: Full `:` command system with quit (`:q`) and restart (`:restart`) functionality
- **Coin Collection**: Interactive coin collection system with score tracking
- **Game States**: Seamless transitions between Main Menu, Playing, Paused, and Game Over states
- **Leaderboard**: Top 10 high scores with localStorage persistence

#### User Interface

- **Main Menu**: Clean interface with leaderboard display, navigation buttons, and instructions
- **Game Screen**: Real-time score display, FPS counter, and visual feedback
- **Pause Menu**: Resume, restart, and quit options with keyboard shortcuts
- **Game Over Screen**: Final score display with retry/restart options

#### Testing & Quality

- **448 Unit Tests**: Comprehensive test coverage (96.11%) across 21 test files
- **16 E2E Tests**: Full user flow validation using Playwright
- **CI/CD Pipeline**: Automated testing, linting, and build verification via GitHub Actions
- **Git Hooks**: Pre-commit formatting and pre-push testing

### Recent Pull Requests

- **#16**: Move Leaderboard above menu buttons - Improved main menu layout for better UX
- **#13**: Update task documentation and configure CI/CD pipeline - Established full testing infrastructure with 464 automated tests
- **#9**: Fix game screen placeholder and quit functionality - Completed core MVP features and Phase 1 tasks

### Technical Details

- **Test Coverage**: 96.11% code coverage
- **Total Tests**: 464 automated tests (448 unit + 16 E2E)
- **Build System**: Vite with ES modules
- **Testing Frameworks**: Vitest (unit) and Playwright (E2E)
- **Code Quality**: ESLint + Prettier with automated formatting

### What's Next

See [ROADMAP.md](./ROADMAP.md) for upcoming Phase 2 features including advanced Vim motions, progressive difficulty, and enhanced visual feedback.

---

For detailed task completion history, see [DONE.md](./DONE.md).
