'use client';

import { useState, useEffect } from 'react';
import { GameTemplate, GameSession } from '@/types/dice';
import { storage } from '@/utils/storage';
import { createCustomDice } from '@/utils/diceUtils';
import { Gamepad2, Users, Play, Plus } from 'lucide-react';

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
  const [activeSessions, setActiveSessions] = useState<GameSession[]>([]);
  const [showNewGameForm, setShowNewGameForm] = useState(false);

  useEffect(() => {
    // Load templates and sessions from storage
    const storedTemplates = storage.getGameTemplates();
    const storedSessions = storage.getGameSessions();
    
    // Initialize with default templates if none exist
    if (storedTemplates.length === 0) {
      storage.saveGameTemplates(defaultGameTemplates);
      setTemplates(defaultGameTemplates);
    } else {
      setTemplates(storedTemplates);
    }
    
    setActiveSessions(storedSessions);
  }, []);

  const startGame = (template: GameTemplate) => {
    const session: GameSession = {
      id: crypto.randomUUID(),
      templateId: template.id,
      players: [`Player 1`, `Player 2`], // Default players
      currentPlayer: 0,
      rolls: [],
      startedAt: Date.now(),
    };

    const updatedSessions = [...activeSessions, session];
    setActiveSessions(updatedSessions);
    storage.saveGameSessions(updatedSessions);
  };

  const endGame = (sessionId: string) => {
    const updatedSessions = activeSessions.filter(session => session.id !== sessionId);
    setActiveSessions(updatedSessions);
    storage.saveGameSessions(updatedSessions);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Game Templates</h2>
        <button
          onClick={() => setShowNewGameForm(!showNewGameForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Active Games */}
      {activeSessions.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-white mb-3">Active Games</h3>
          <div className="space-y-2">
            {activeSessions.map((session) => {
              const template = templates.find(t => t.id === session.templateId);
              return (
                <div key={session.id} className="bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-white">{template?.name || 'Unknown Game'}</div>
                      <div className="text-sm text-gray-400">
                        {session.players.length} players • {session.rolls.length} rolls
                      </div>
                    </div>
                    <button
                      onClick={() => endGame(session.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      End Game
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Game Templates */}
      <div>
        <h3 className="text-md font-semibold text-white mb-3">Available Games</h3>
        <div className="space-y-3">
          {templates.map((template) => (
            <div key={template.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-white">{template.name}</h4>
                  <p className="text-sm text-gray-400">{template.description}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users className="w-3 h-3" />
                  {template.minPlayers}-{template.maxPlayers}
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">Dice:</div>
                <div className="flex gap-2">
                  {template.dice.map((dice) => (
                    <div
                      key={dice.id}
                      className="px-2 py-1 bg-gray-600 rounded text-xs text-white"
                      style={{ borderLeft: `3px solid ${dice.color}` }}
                    >
                      {dice.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">Rules:</div>
                <p className="text-sm text-gray-300">{template.rules}</p>
              </div>

              <button
                onClick={() => startGame(template)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Game
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* New Game Form Placeholder */}
      {showNewGameForm && (
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-md font-semibold text-white mb-3">Create New Game</h3>
          <p className="text-gray-400 text-sm mb-4">
            Game template creation coming soon! For now, you can use the pre-built games above.
          </p>
          <button
            onClick={() => setShowNewGameForm(false)}
            className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
} 