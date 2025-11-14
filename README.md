# Vim Motions Arcade 🎮⌨️

> Master vim motions through addictive arcade gameplay

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](https://www.ecma-international.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

**Vim Motions Arcade** is an open-source browser-based game that teaches vim text editor motions through engaging arcade gameplay. Learn to navigate like a vim master by collecting power-ups, dodging obstacles, and racing against the clock in procedurally-generated levels that look like vim documents.

[Play the Game](#) • [Read the Docs](./docs/) • [Report Bug](../../issues) • [Request Feature](../../issues)

---

## 🎯 What is This?

One of the most compelling aspects of vim is its video-game-like use of key sequences that feel like gaming combos. **Vim Motions Arcade** transforms the daunting task of learning vim into an addictive arcade experience where you build muscle memory naturally while having fun.

Navigate a cursor block through "documents" made of word-like blocks, collect coins and power-ups that unlock new vim commands, avoid obstacles, and master efficient movement patterns—all while racing against the clock.

**Core Hook**: Instead of reading documentation, you'll _play_ your way to vim mastery.

---

## 🕹️ Key Features

- **🎮 Arcade Gameplay**: Fast-paced action that makes learning vim motions engaging and fun
- **📚 Progressive Learning**: Start with `hjkl`, unlock advanced motions like `w`, `b`, `{`, `}`, and beyond
- **🎨 Retro Aesthetic**: Beautiful monospaced terminal style with vibrant arcade colors
- **⚡ Visual Effects**: Motion blur, particle effects, and satisfying feedback for every action
- **🔄 Procedural Generation**: Every level is unique—no memorization, just pure vim skill
- **🏆 Progression System**: Level up, unlock themes, and earn permanent upgrades
- **🎵 Dynamic Audio**: Sound effects and music that respond to your gameplay
- **♿ Accessibility**: Colorblind modes, reduced motion options, and keyboard-only controls

---

## 🎓 What are Vim Motions?

[Vim](<https://en.wikipedia.org/wiki/Vim_(text_editor)>) is a modal text editor that runs on virtually every computer platform. Based on [vi](<https://en.wikipedia.org/wiki/Vi_(text_editor)>), first released by [Bill Joy](https://en.wikipedia.org/wiki/Bill_Joy) in 1976, vim works in text-only environments where there's no mouse or graphical interface.

Vim uses a modal system where different modes (normal, visual, insert, command) perform different operations. The default "normal" mode supports a vast array of powerful motions to navigate text documents. These **vim motions** become extraordinarily powerful once an experienced user has installed them in "muscle memory"—enabling navigation at the speed of thought.

**Vim Motions Arcade** teaches you these essential movements through gameplay:

| Motion        | Command         | What it Does                 |
| ------------- | --------------- | ---------------------------- |
| **Character** | `hjkl`          | Move left, down, up, right   |
| **Word**      | `w` `b` `e`     | Jump between words           |
| **Line**      | `0` `$` `^`     | Jump to line start/end       |
| **Paragraph** | `{` `}`         | Navigate by paragraphs       |
| **Search**    | `f` `F` `/`     | Find characters and patterns |
| **Visual**    | `v` `y` `d` `p` | Select, copy, delete, paste  |

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A physical keyboard (Bluetooth keyboards work on mobile devices!)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/vim-motions-arcade.git
   cd vim-motions-arcade
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**

   ```
   Navigate to http://localhost:3000
   ```

### Quick Start

```bash
# Clone and play in 3 commands
git clone https://github.com/yourusername/vim-motions-arcade.git
cd vim-motions-arcade && npm install && npm run dev
```

---

## 🎮 How to Play

### Basic Controls

- **Movement**: Use `h` `j` `k` `l` (left, down, up, right)
- **Command Mode**: Press `:` then type commands like `quit`, `help`, or `pause`
- **Pause**: Type `:pause` or press `Esc` then `:`

### Gameplay Loop

1. **Navigate** the cursor block through the document-like map
2. **Collect** coins (worth points) and power-ups (unlock vim motions)
3. **Avoid** obstacles that damage your health
4. **Master** new motions as you unlock them
5. **Complete** levels before time runs out for bonus points
6. **Level up** to unlock permanent upgrades and new challenges

### Pro Tips

- 💡 **Coins at word boundaries**: Use `w` and `b` to grab them efficiently
- ⚡ **Build combos**: Chain efficient movements together for score multipliers
- 🎯 **Perfect clears**: Collect all coins for a huge time bonus
- 🚀 **Use power-ups wisely**: Some have cooldowns, so plan your route

---

## 🛠️ Technology Stack

### Why JavaScript?

We chose JavaScript to showcase what's possible in the browser. At [Cadent Technologies Corp.](https://cadent.net), we specialize in fun, interactive web experiences. This project is our way of exploring JavaScript as a game-development tool while giving back to the vim community.

### Built With

- **JavaScript (ES6+)**: Pure vanilla JS for maximum compatibility
- **HTML5 Canvas / DOM**: Hybrid rendering for performance and flexibility
- **Web Audio API**: Dynamic sound effects and music
- **LocalStorage**: Save progress and unlocks
- **CSS3**: Modern UI styling and animations

### Architecture

```
vim-motions-arcade/
├── src/
│   ├── core/           # Game engine, state management
│   ├── entities/       # Player, obstacles, power-ups
│   ├── rendering/      # Canvas/DOM rendering systems
│   ├── audio/          # Sound effects and music
│   ├── levels/         # Procedural generation
│   └── ui/             # HUD, menus, popups
├── assets/
│   ├── sounds/         # Audio files
│   └── themes/         # Visual themes
├── docs/               # Documentation
└── tests/              # Unit and integration tests
```

---

## 📖 Documentation

- **[Product Requirements Document](./docs/PRD.md)**: Complete game design specification
- **[Development Roadmap](./docs/ROADMAP.md)**: Phased development plan
- **[Contributing Guide](./CONTRIBUTING.md)**: How to contribute to the project
- **[Vim Motion Reference](./docs/VIM_MOTIONS.md)**: Complete list of vim commands in the game

---

## 🗺️ Roadmap

[View detailed roadmap →](./docs/ROADMAP.md)

---

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, improving documentation, or designing levels, your help is appreciated.

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Ideas

- 🎨 **Design**: Create new themes, visual effects, or UI improvements
- 🎵 **Audio**: Compose music or create sound effects
- 🎮 **Gameplay**: Design new mechanics, power-ups, or obstacles
- 📝 **Documentation**: Improve guides, add tutorials, or write blog posts
- 🐛 **Bug Fixes**: Find and fix issues
- ✨ **Features**: Implement items from the roadmap
- 🧪 **Testing**: Write tests or do manual QA

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and development process.

---

## 📊 Project Status

**Current Version**: 0.1.0 (Alpha)
**Development Phase**: Phase 1 - Core Prototype (~40% complete)
**Status**: Active Development 🚧

### Quick Stats

- **Source Code**: ~1,090 lines (JavaScript, CSS, HTML)
- **Test Code**: ~570 lines (62 unit tests, all passing ✅)
- **Core Systems**: Screen management, save system, leaderboard, command mode ✅
- **Contributors**: 1
- **Open Issues**: 0
- **Stars**: ⭐ Help us reach 100!

### What's Working Now

- ✅ Interactive main menu with retro arcade aesthetic
- ✅ Screen transitions (menu, game, level complete/failed)
- ✅ Save/Continue game functionality with localStorage
- ✅ Local leaderboard (top 10 scores)
- ✅ Command mode logic (`:q`, `:quit`, `:help`)
- ⏳ Gameplay mechanics (map generation, player movement, scoring) - Coming next!

---

## 🎯 Goals & Philosophy

### Project Goals

1. **Make vim accessible**: Lower the barrier to learning vim through gamification
2. **Build muscle memory**: Create lasting habits through repetition and reward
3. **Showcase JavaScript**: Demonstrate browser-based game development
4. **Community-driven**: Create an open-source project that grows with contributions
5. **Educational excellence**: Provide the best vim learning experience available

### Design Philosophy

- **Fun first**: If it's not fun, it's not effective education
- **Progressive disclosure**: Introduce complexity gradually
- **Immediate feedback**: Every action should feel responsive and satisfying
- **Accessibility**: Everyone should be able to play and learn
- **Open source**: Transparent development, community ownership

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Bram Moolenaar](https://en.wikipedia.org/wiki/Bram_Moolenaar)**: Creator of Vim (1991-2023)
- **[Bill Joy](https://en.wikipedia.org/wiki/Bill_Joy)**: Creator of vi (1976)
- **Vim Community**: For decades of amazing tools and learning resources
- **Open Source Contributors**: Everyone who helps make this project better

---

## 🔗 Links

- **Website**: [Coming Soon](#)
- **Demo**: [Play Now](#)
- **Documentation**: [Read the Docs](#)
- **Blog**: [Development Updates](#)
- **Discord**: [Join the Community](#)
- **Twitter**: [@VimMotionsGame](#)

---

## 💬 Get in Touch

- **Issues**: [GitHub Issues](../../issues)
- **Discussions**: [GitHub Discussions](../../discussions)
- **Email**: hello@cadent.net
- **Website**: [cadent.net](https://cadent.net)

---

## 🎓 Learn More About Vim

New to vim? Check out these resources:

- **[Vim Documentation](https://www.vim.org/docs.php)**: Official vim docs
- **[OpenVim](https://www.openvim.com/)**: Interactive vim tutorial
- **[Vim Adventures](https://vim-adventures.com/)**: Another vim game (inspiration!)
- **[Practical Vim](https://pragprog.com/titles/dnvim2/practical-vim-second-edition/)**: Excellent book by Drew Neil
- **[r/vim](https://www.reddit.com/r/vim/)**: Active vim community on Reddit

---

## 📈 Stats & Metrics

![GitHub stars](https://img.shields.io/github/stars/yourusername/vim-motions-arcade?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/vim-motions-arcade?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/yourusername/vim-motions-arcade?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/yourusername/vim-motions-arcade)
![GitHub issues](https://img.shields.io/github/issues/yourusername/vim-motions-arcade)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/vim-motions-arcade)

---

<div align="center">

**Made with ❤️ by [Cadent Technologies Corp.](https://cadent.net)**

_Empowering developers, one vim motion at a time_

[⬆ Back to Top](#vim-motions-arcade-)

</div>
