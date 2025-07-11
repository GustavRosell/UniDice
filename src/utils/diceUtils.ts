import { StandardDice, CustomDice, RollResult } from '@/types/dice';

export const standardDice: StandardDice[] = [
  { id: 'd4', type: 'standard', sides: 4, name: 'D4', color: '#ef4444' },
  { id: 'd6', type: 'standard', sides: 6, name: 'D6', color: '#3b82f6' },
  { id: 'd8', type: 'standard', sides: 8, name: 'D8', color: '#10b981' },
  { id: 'd10', type: 'standard', sides: 10, name: 'D10', color: '#f59e0b' },
  { id: 'd12', type: 'standard', sides: 12, name: 'D12', color: '#8b5cf6' },
  { id: 'd20', type: 'standard', sides: 20, name: 'D20', color: '#ec4899' },
];

// UUID helper for cross-browser compatibility
function getUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback: RFC4122 version 4 compliant UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const rollDice = (dice: StandardDice | CustomDice): RollResult => {
  const id = getUUID();
  const timestamp = Date.now();
  
  if (dice.type === 'standard') {
    const result = Math.floor(Math.random() * dice.sides) + 1;
    return {
      id,
      diceId: dice.id,
      diceName: dice.name,
      result,
      timestamp,
    };
  } else {
    const randomIndex = Math.floor(Math.random() * dice.sides.length);
    const result = dice.sides[randomIndex];
    return {
      id,
      diceId: dice.id,
      diceName: dice.name,
      result,
      timestamp,
    };
  }
};

export const createCustomDice = (
  name: string,
  sides: string[],
  color: string
): CustomDice => {
  return {
    id: getUUID(),
    type: 'custom',
    name,
    sides,
    color,
  };
};

export const validateCustomDice = (name: string, sides: string[]): string | null => {
  if (!name.trim()) {
    return 'Dice name is required';
  }
  
  if (sides.length < 2) {
    return 'Dice must have at least 2 sides';
  }
  
  if (sides.some(side => !side.trim())) {
    return 'All sides must have values';
  }
  
  return null;
};

export const getDiceColor = (dice: StandardDice | CustomDice): string => {
  return dice.color;
};

export const formatRollResult = (result: string | number): string => {
  return String(result);
}; 