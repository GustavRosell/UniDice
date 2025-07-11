import { RollResult, GameTemplate, GameSession, CustomDice } from '@/types/dice';

const STORAGE_KEYS = {
  CUSTOM_DICE: 'dice-roller-custom-dice',
  ROLL_HISTORY: 'dice-roller-history',
  GAME_SESSIONS: 'dice-roller-game-sessions',
  GAME_TEMPLATES: 'dice-roller-game-templates',
} as const;

export const storage = {
  getCustomDice: (): CustomDice[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_DICE);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveCustomDice: (dice: CustomDice[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_DICE, JSON.stringify(dice));
    } catch (error) {
      console.error('Failed to save custom dice:', error);
    }
  },

  getRollHistory: (): RollResult[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ROLL_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveRollHistory: (history: RollResult[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.ROLL_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save roll history:', error);
    }
  },

  addRollToHistory: (roll: RollResult): void => {
    const history = storage.getRollHistory();
    history.unshift(roll);
    // Keep only last 100 rolls
    if (history.length > 100) {
      history.splice(100);
    }
    storage.saveRollHistory(history);
  },

  getGameSessions: (): GameSession[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GAME_SESSIONS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveGameSessions: (sessions: GameSession[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.GAME_SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save game sessions:', error);
    }
  },

  getGameTemplates: (): GameTemplate[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GAME_TEMPLATES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveGameTemplates: (templates: GameTemplate[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.GAME_TEMPLATES, JSON.stringify(templates));
    } catch (error) {
      console.error('Failed to save game templates:', error);
    }
  },
}; 