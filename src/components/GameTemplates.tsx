'use client';

import { useState, useEffect } from 'react';
import { GameTemplate } from '@/types/dice';
import { storage } from '@/utils/storage';
import { createCustomDice } from '@/utils/diceUtils';
import { Users, Play, Plus } from 'lucide-react';

const defaultGameTemplates: GameTemplate[] = [
  {
    id: 'meyer',
    name: 'Meyer',
    description: 'A traditional Danish dice game for 2-4 players',
    dice: [
      { id: 'd6-1', type: 'standard', sides: 6, name: 'D6', color: '#3b82f6' },
      { id: 'd6-2', type: 'standard', sides: 6, name: 'D6', color: '#ef4444' },
    ],
    rules: 'Roll two dice. The highest combination wins. 21 (6+6) is the highest, followed by 31 (6+5), 32 (6+4), etc. 11 (1+1) is the lowest.',
    minPlayers: 2,
    maxPlayers: 4,
  },
  {
    id: 'yahtzee',
    name: 'Yahtzee',
    description: 'Classic dice game with scoring categories',
    dice: [
      { id: 'd6-1', type: 'standard', sides: 6, name: 'D6', color: '#3b82f6' },
      { id: 'd6-2', type: 'standard', sides: 6, name: 'D6', color: '#ef4444' },
      { id: 'd6-3', type: 'standard', sides: 6, name: 'D6', color: '#10b981' },
      { id: 'd6-4', type: 'standard', sides: 6, name: 'D6', color: '#f59e0b' },
      { id: 'd6-5', type: 'standard', sides: 6, name: 'D6', color: '#8b5cf6' },
    ],
    rules: 'Roll 5 dice up to 3 times. Score based on combinations like three of a kind, full house, yahtzee (five of a kind), etc.',
    minPlayers: 1,
    maxPlayers: 10,
  },
  {
    id: 'color-game',
    name: 'Color Game',
    description: 'Simple color-based dice game',
    dice: [
      createCustomDice('Color Dice', ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'], '#ec4899'),
    ],
    rules: 'Roll the color dice. Each player takes turns rolling and must perform an action based on the color rolled.',
    minPlayers: 2,
    maxPlayers: 6,
  },
];

export function GameTemplates() {
  const [templates, setTemplates] = useState<GameTemplate[]>([]);
  const [showNewGameForm, setShowNewGameForm] = useState(false);

  useEffect(() => {
    const storedTemplates = storage.getGameTemplates();
    if (storedTemplates.length === 0) {
      storage.saveGameTemplates(defaultGameTemplates);
      setTemplates(defaultGameTemplates);
    } else {
      setTemplates(storedTemplates);
    }
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center justify-between w-full mb-6">
        <h2 className="text-2xl font-bold text-white">Games</h2>
        <button
          onClick={() => setShowNewGameForm(!showNewGameForm)}
          className="ml-2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 shadow-lg border border-white/20"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        {templates.map((template) => (
          <div key={template.id} className="game-template-card flex flex-col items-start">
            <div className="flex items-center justify-between w-full mb-2">
              <h4 className="font-semibold text-white text-lg">{template.name}</h4>
              <div className="flex items-center gap-1 text-xs text-white/70">
                <Users className="w-4 h-4" />
                {template.minPlayers}-{template.maxPlayers}
              </div>
            </div>
            <p className="text-sm text-white/70 mb-2">{template.description}</p>
            <div className="flex gap-2 mb-2">
              {template.dice.map((dice) => (
                <div
                  key={dice.id}
                  className="px-2 py-1 rounded bg-white/10 text-xs text-white border border-white/20"
                  style={{ borderLeft: `3px solid ${dice.color}` }}
                >
                  {dice.name}
                </div>
              ))}
            </div>
            <div className="text-xs text-white/60 mb-3">{template.rules}</div>
            <button
              className="w-full btn-primary flex items-center justify-center gap-2 mt-auto"
              disabled
            >
              <Play className="w-4 h-4" />
              Start Game (Coming Soon)
            </button>
          </div>
        ))}
      </div>
      {/* New Game Modal Placeholder */}
      {showNewGameForm && (
        <div className="modal-overlay" onClick={() => setShowNewGameForm(false)}>
          <div className="modal-card relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-3 right-3 text-white/60 hover:text-white text-2xl" onClick={() => setShowNewGameForm(false)}>&times;</button>
            <h3 className="text-xl font-bold text-white mb-4">Create New Game</h3>
            <p className="text-white/70 mb-4">Game template creation coming soon! For now, you can use the pre-built games above.</p>
            <button
              onClick={() => setShowNewGameForm(false)}
              className="btn-secondary w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 