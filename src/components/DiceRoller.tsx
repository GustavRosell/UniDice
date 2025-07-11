'use client';

import { useState } from 'react';
import { StandardDice, CustomDice, RollResult } from '@/types/dice';
import { Dice } from 'lucide-react';

interface DiceRollerProps {
  dice: (StandardDice | CustomDice)[];
  onRoll: (dice: StandardDice | CustomDice) => void;
}

export function DiceRoller({ dice, onRoll }: DiceRollerProps) {
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = async (dice: StandardDice | CustomDice) => {
    setIsRolling(true);
    
    // Simulate rolling animation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { rollDice } = require('@/utils/diceUtils');
    const roll = rollDice(dice);
    setLastRoll(roll);
    onRoll(dice);
    setIsRolling(false);
  };

  const renderDice = (dice: StandardDice | CustomDice) => {
    const isStandard = dice.type === 'standard';
    const sides = isStandard ? dice.sides : dice.sides.length;
    
    return (
      <button
        key={dice.id}
        onClick={() => handleRoll(dice)}
        disabled={isRolling}
        className={`relative group p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
          isRolling ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400'
        }`}
        style={{ borderColor: dice.color }}
      >
        <div className="flex flex-col items-center space-y-2">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg"
            style={{ backgroundColor: dice.color }}
          >
            <Dice className="w-6 h-6" />
          </div>
          <div className="text-center">
            <div className="font-semibold text-white">{dice.name}</div>
            <div className="text-sm text-gray-400">
              {isStandard ? `${sides} sides` : `${sides} values`}
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Last Roll Display */}
      {lastRoll && (
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-400 mb-1">Last Roll</div>
          <div className="text-2xl font-bold text-white">
            {lastRoll.diceName}: {lastRoll.result}
          </div>
        </div>
      )}

      {/* Dice Grid */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Available Dice</h2>
        <div className="grid grid-cols-2 gap-4">
          {dice.map(renderDice)}
        </div>
      </div>

      {/* Quick Roll Section */}
      <div>
        <h3 className="text-md font-semibold text-white mb-3">Quick Roll</h3>
        <div className="grid grid-cols-3 gap-3">
          {[6, 20, 100].map((sides) => (
            <button
              key={sides}
              onClick={() => handleRoll({ id: `d${sides}`, type: 'standard', sides: sides as any, name: `D${sides}`, color: '#3b82f6' })}
              disabled={isRolling}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              D{sides}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 