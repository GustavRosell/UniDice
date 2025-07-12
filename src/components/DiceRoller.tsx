'use client';

import React, { useState } from 'react';
import { StandardDice, CustomDice, RollResult } from '@/types/dice';
import { rollDice } from '@/utils/diceUtils';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Settings, Folder } from 'lucide-react';
import { CreateDiceModal } from './CreateDiceModal';

interface DiceRollerProps {
  dice: (StandardDice | CustomDice)[];
  onRoll: (dice: StandardDice | CustomDice) => void;
  onCustomDiceChange?: (dice: CustomDice[]) => void;
}

// AnimatedDiceFace component
function AnimatedDiceFace({ value, isRolling, dice }: { value: string | number; isRolling: boolean; dice: StandardDice | CustomDice }) {
  // For standard dice 1-6, show dots; for >6, show number; for color dice, show color
  const isNumber = typeof value === 'number' && !isNaN(Number(value));
  const numValue = Number(value);
  const isColorDice = dice.type === 'custom' && dice.sides.every(s => /^#([0-9A-F]{3}){1,2}$/i.test(s) || /^rgb|hsl|\w+$/i.test(s));

  // Dot positions for 1-6
  const dotPositions = {
    1: ['center'],
    2: ['top-left', 'bottom-right'],
    3: ['top-left', 'center', 'bottom-right'],
    4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
    6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right']
  };
  const getDotClass = (position: string) => {
    const base = 'absolute w-5 h-5 bg-white rounded-full shadow-md';
    const positionClasses = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'middle-left': 'top-1/2 left-4 -translate-y-1/2',
      'middle-right': 'top-1/2 right-4 -translate-y-1/2',
      'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4'
    };
    return base + ' ' + positionClasses[position as keyof typeof positionClasses];
  };

  // Color dice: show a big colored circle
  if (isColorDice) {
    return (
      <div
        className={`relative w-32 h-32 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30 transition-all duration-300 ${isRolling ? 'animate-spin-slow scale-110' : 'scale-100'}`}
        style={{ background: value as string }}
      >
        <span className="text-white font-bold text-2xl drop-shadow-lg select-none">
          {value}
        </span>
      </div>
    );
  }

  // Standard dice: show dots for 1-6, number for >6
  return (
    <div
      className={`relative w-32 h-32 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white/30 bg-gradient-to-br from-blue-500 to-purple-600 transition-all duration-300 select-none ${isRolling ? 'animate-spin-slow scale-110' : 'scale-100'}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {isNumber && numValue >= 1 && numValue <= 6 ? (
        dotPositions[numValue as 1|2|3|4|5|6].map((pos, i) => (
          <div key={i} className={getDotClass(pos)} />
        ))
      ) : (
        <span className="text-white font-extrabold text-5xl drop-shadow-lg select-none">
          {value}
        </span>
      )}
    </div>
  );
}

export function DiceRoller({ dice, onRoll, onCustomDiceChange }: DiceRollerProps) {
  const [focusDice, setFocusDice] = useState<StandardDice | CustomDice | null>(null);
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const customDice = dice.filter(d => d.type === 'custom') as CustomDice[];

  const handleOpenModal = (dice: StandardDice | CustomDice) => {
    setFocusDice(dice);
    setLastRoll(null);
    setIsCelebrating(false);
  };

  const handleCloseModal = () => {
    setFocusDice(null);
    setLastRoll(null);
    setIsCelebrating(false);
  };

  const handleRoll = async () => {
    if (!focusDice) return;
    setIsRolling(true);
    setIsCelebrating(false);
    await new Promise(resolve => setTimeout(resolve, 900));
    const roll = rollDice(focusDice);
    setLastRoll(roll);
    onRoll(focusDice);
    setIsRolling(false);
    setIsCelebrating(true);
    setTimeout(() => setIsCelebrating(false), 1200);
  };

  const handleCreateDice = (data: { name: string; type: 'numbers' | 'colors'; min?: number; max?: number; colors?: string[] }) => {
    if (!onCustomDiceChange) return;
    if (!data.name.trim()) return;
    let newDice: CustomDice;
    if (data.type === 'numbers') {
      const min = data.min ?? 1;
      const max = data.max ?? 6;
      const sides = Array.from({ length: max - min + 1 }, (_, i) => String(i + min));
      newDice = {
        id: 'custom-' + Date.now(),
        type: 'custom',
        name: data.name,
        sides,
        color: '#8884FF',
      };
    } else {
      newDice = {
        id: 'custom-' + Date.now(),
        type: 'custom',
        name: data.name,
        sides: data.colors ?? [],
        color: (data.colors && data.colors[0]) || '#8884FF',
      };
    }
    onCustomDiceChange([...customDice, newDice]);
  };

  const renderDiceButton = (dice: StandardDice | CustomDice) => {
    if (dice.type !== 'standard') return null; // Only render standard dice this way
    const sides = dice.sides as number;
    let iconComponents: React.ReactElement[] = [];
    let iconSize = 48; // Larger for single
    let layoutClass = 'flex justify-center items-center w-20 h-20';
    let numIcons = 1;
    let pips = sides;

    if (sides <= 6) {
      const Icon = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6][sides - 1];
      iconComponents = [<Icon key={0} size={iconSize} />];
    } else {
      if (sides === 8) {
        numIcons = 2;
        pips = 4;
        iconSize = 36;
      } else if (sides === 10) {
        numIcons = 2;
        pips = 5;
        iconSize = 36;
      } else if (sides === 12) {
        numIcons = 2;
        pips = 6;
        iconSize = 36;
      } else if (sides === 20) {
        numIcons = 4;
        pips = 5;
        iconSize = 36;
        layoutClass = 'grid grid-cols-2 gap-1 w-20 h-20';
      } else if (sides === 100) {
        numIcons = 10;
        pips = 6;
        iconSize = 18;
        layoutClass = 'grid grid-cols-5 gap-1 w-20 h-20'; // 2 rows of 5
      } else {
        return null; // Fallback
      }
      if (numIcons === 2) {
        layoutClass = 'flex flex-row justify-center items-center gap-1 w-20 h-20';
      }
      const Icon = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6][pips - 1];
      iconComponents = Array.from({ length: numIcons }, (_, i) => <Icon key={i} size={iconSize} />);
    }

    return (
      <button
        key={dice.id}
        onClick={() => handleOpenModal(dice)}
        className="dice-button w-28 h-28 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200"
      >
        <div className={layoutClass}>
          {iconComponents}
        </div>
      </button>
    );
  };

  // Only show standard dice in the main grid
  const standardDice = dice.filter(d => d.type === 'standard');

  const buttons = standardDice.map(renderDiceButton);
  // Add two custom buttons as the last row
  const myDiceButton = (
    <button
      key="my-dice"
      onClick={() => { /* TODO: open custom dice modal */ }}
      className="w-28 h-28 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg text-white hover:bg-gradient-to-br hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
    >
      <Folder size={32} />
      <span className="text-sm font-medium mt-2">My Dice</span>
    </button>
  );
  const createDiceButton = (
    <button
      key="create-dice"
      onClick={() => setShowCreateModal(true)}
      className="w-28 h-28 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-pink-500 rounded-lg text-white hover:bg-gradient-to-br hover:from-blue-600 hover:to-pink-600 transition-all duration-200"
    >
      <Settings size={32} />
      <span className="text-sm font-medium mt-2">Create Dice</span>
    </button>
  );
  // Remove the old custom button if present
  if (buttons.length > 6) buttons.splice(6, 1);
  // Add the two new buttons as the last row
  buttons.push(myDiceButton, createDiceButton);

  return (
    <>
      <div className="flex flex-col items-center w-full">
        <h2 className="text-2xl font-bold text-white mb-8 mt-2">Standard Dice</h2>
        <div className="grid grid-cols-2 gap-6 mb-8">
          {buttons.map((button, index) => (
            <React.Fragment key={index}>
              {button}
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Modern Large Dice Roll Modal */}
      {focusDice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl" onClick={handleCloseModal}>
          <div
            className="relative w-full max-w-lg mx-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col items-center justify-center py-12 px-4"
            style={{ minHeight: 420 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 z-10"
              onClick={handleCloseModal}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Animated Dice Face */}
            <div className="flex flex-col items-center w-full">
              <AnimatedDiceFace
                value={isRolling ? '?' : lastRoll ? lastRoll.result : focusDice.type === 'custom' && focusDice.sides.length > 0 ? focusDice.sides[0] : ''}
                isRolling={isRolling}
                dice={focusDice}
              />
              {/* Dice name and info */}
              <div className="text-center mb-8 mt-8">
                <div className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{focusDice.name}</div>
                <div className="text-white/70 text-base font-medium">
                  {focusDice.type === 'standard'
                    ? `${focusDice.sides} sides`
                    : `${focusDice.sides.length} values`}
                </div>
              </div>
              {/* Roll Button */}
              <button
                onClick={handleRoll}
                disabled={isRolling}
                className={`w-full max-w-xs h-16 rounded-2xl border-2 border-white/30 bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white font-bold text-lg flex items-center justify-center shadow-xl transition-all duration-300 overflow-hidden group mb-2 ${
                  isRolling
                    ? 'animate-pulse cursor-not-allowed' 
                    : 'hover:from-blue-500 hover:to-purple-500 hover:scale-105 hover:shadow-2xl active:scale-95'
                }`}
              >
                {isRolling ? (
                  <>
                    <div className="w-7 h-7 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Rolling...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🎲</span>
                    {lastRoll ? 'Roll Again' : 'Roll Dice'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Create Dice Modal */}
      <CreateDiceModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateDice}
      />
    </>
  );
} 