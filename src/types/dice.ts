export interface StandardDice {
  id: string;
  type: 'standard';
  sides: 4 | 6 | 8 | 10 | 12 | 20;
  name: string;
  color: string;
}

export interface CustomDice {
  id: string;
  type: 'custom';
  name: string;
  sides: string[];
  color: string;
}

export type Dice = StandardDice | CustomDice;

export interface RollResult {
  id: string;
  diceId: string;
  diceName: string;
  result: string | number;
  timestamp: number;
  gameId?: string;
}

export interface GameTemplate {
  id: string;
  name: string;
  description: string;
  dice: Dice[];
  rules: string;
  minPlayers: number;
  maxPlayers: number;
}

export interface GameSession {
  id: string;
  templateId: string;
  players: string[];
  currentPlayer: number;
  rolls: RollResult[];
  startedAt: number;
} 