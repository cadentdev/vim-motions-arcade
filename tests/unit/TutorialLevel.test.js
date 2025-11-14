import { describe, it, expect, beforeEach } from 'vitest';
import { TutorialLevel } from '../../src/game/TutorialLevel.js';
import { SaveManager } from '../../src/storage/SaveManager.js';

describe('TutorialLevel', () => {
  let tutorialLevel;
  let saveManager;

  beforeEach(() => {
    saveManager = new SaveManager();
    saveManager.deleteSave(); // Start fresh
    tutorialLevel = new TutorialLevel(saveManager);
  });

  describe('Initialization', () => {
    it('should create tutorial level instance', () => {
      expect(tutorialLevel).toBeDefined();
    });

    it('should not be completed initially', () => {
      expect(tutorialLevel.isCompleted()).toBe(false);
    });

    it('should have tutorial content', () => {
      const content = tutorialLevel.getContent();
      expect(content).toBeDefined();
      expect(content.title).toBeDefined();
      expect(content.instructions).toBeDefined();
    });
  });

  describe('Content', () => {
    it('should have "How to Quit Vim" as title', () => {
      const content = tutorialLevel.getContent();
      expect(content.title).toContain('Quit Vim');
    });

    it('should have instructions about :q command', () => {
      const content = tutorialLevel.getContent();
      expect(content.instructions).toContain(':q');
    });

    it('should have welcome message', () => {
      const content = tutorialLevel.getContent();
      expect(content.instructions).toContain('Welcome');
    });
  });

  describe('Completion Detection', () => {
    it('should detect :q command as completion', () => {
      const result = tutorialLevel.handleCommand('q');
      expect(result.completed).toBe(true);
    });

    it('should detect :quit command as completion', () => {
      const result = tutorialLevel.handleCommand('quit');
      expect(result.completed).toBe(true);
    });

    it('should not complete on other commands', () => {
      const result = tutorialLevel.handleCommand('help');
      expect(result.completed).toBe(false);
    });

    it('should not complete on invalid commands', () => {
      const result = tutorialLevel.handleCommand('xyz');
      expect(result.completed).toBe(false);
    });
  });

  describe('Persistence', () => {
    it('should mark tutorial as complete in save', () => {
      tutorialLevel.handleCommand('q');
      tutorialLevel.markComplete();

      expect(tutorialLevel.isCompleted()).toBe(true);
    });

    it('should save completion to localStorage', () => {
      tutorialLevel.handleCommand('q');
      tutorialLevel.markComplete();

      // Create new instance and check persistence
      const newTutorial = new TutorialLevel(saveManager);
      expect(newTutorial.isCompleted()).toBe(true);
    });

    it('should not be completed after clearing save', () => {
      tutorialLevel.markComplete();
      saveManager.deleteSave();

      const newTutorial = new TutorialLevel(saveManager);
      expect(newTutorial.isCompleted()).toBe(false);
    });
  });

  describe('Tutorial State', () => {
    it('should provide appropriate hint when not completed', () => {
      const hint = tutorialLevel.getHint();
      expect(hint).toBeDefined();
      expect(hint.toLowerCase()).toContain('q');
    });

    it('should return completion message on success', () => {
      const result = tutorialLevel.handleCommand('q');
      expect(result.message).toBeDefined();
      expect(result.message.toLowerCase()).toContain('success');
    });

    it('should be replayable even after completion', () => {
      tutorialLevel.markComplete();

      // Can still run through tutorial
      const result = tutorialLevel.handleCommand('quit');
      expect(result.completed).toBe(true);
    });
  });

  describe('Integration with SaveManager', () => {
    it('should check completion status from save data', () => {
      // Directly set tutorial completion in save
      const save = saveManager.loadGame() || {};
      save.tutorialCompleted = true;
      saveManager.saveGame(save);

      const newTutorial = new TutorialLevel(saveManager);
      expect(newTutorial.isCompleted()).toBe(true);
    });

    it('should update save data when marking complete', () => {
      tutorialLevel.markComplete();

      const save = saveManager.loadGame();
      expect(save.tutorialCompleted).toBe(true);
    });
  });
});
