'use client';

import React, { useState } from 'react';
import { StandardDice, CustomDice, RollResult } from '@/types/dice';
import { rollDice } from '@/utils/diceUtils';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Settings, Folder } from 'lucide-react';
import { CreateDiceModal } from './CreateDiceModal';

interface DiceRollerProps {
  dice: (StandardDice | CustomDice)[];
  onRoll: (dice: StandardDice | CustomDice) => void;
  onTabChange?: (tab: 'roll' | 'custom' | 'history' | 'games') => void;
  onCustomDiceChange?: (dice: CustomDice[]) => void;
}

export function DiceRoller({ dice, onRoll, onTabChange, onCustomDiceChange }: DiceRollerProps) {
  const [focusDice, setFocusDice] = useState<StandardDice | CustomDice | null>(null);
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const customDice = dice.filter(d => d.type === 'custom') as CustomDice[];

  const handleOpenModal = (dice: StandardDice | CustomDice) => {
    setFocusDice(dice);
    setLastRoll(null);
  };

  const handleCloseModal = () => {
    setFocusDice(null);
    setLastRoll(null);
  };

  const handleRoll = async () => {
    if (!focusDice) return;
    setIsRolling(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const roll = rollDice(focusDice);
    setLastRoll(roll);
    onRoll(focusDice);
    setIsRolling(false);
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
      {/* Dice Focus Modal */}
      {focusDice && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-card relative flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button className="absolute top-3 right-3 text-white/60 hover:text-white text-2xl" onClick={handleCloseModal}>&times;</button>
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-blue-500 to-purple-500">
                <Dice1 className="w-12 h-12" />
              </div>
              <div className="text-xl font-bold text-white mb-2">{focusDice.name}</div>
              <div className="text-sm text-white/70 mb-2">
                {focusDice.type === 'standard' ? `${focusDice.sides} sides` : `${focusDice.sides.length} values`}
              </div>
            </div>
            <button
              onClick={handleRoll}
              disabled={isRolling}
              className="w-40 h-40 rounded-full border-4 border-white/60 bg-white/10 text-white text-2xl font-bold flex flex-col items-center justify-center shadow-xl transition-all duration-200 active:scale-95 mb-4"
            >
              <Dice1 className="w-16 h-16 mb-2" />
              Roll
            </button>
            {lastRoll && (
              <div className="mt-4 text-center">
                <div className="text-lg text-white/80">Result:</div>
                <div className="text-4xl font-bold text-white mt-1">{lastRoll.result}</div>
              </div>
            )}
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