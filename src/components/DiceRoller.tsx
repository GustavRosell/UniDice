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
  const [isCelebrating, setIsCelebrating] = useState(false);
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
    setIsCelebrating(false);
    await new Promise(resolve => setTimeout(resolve, 800));
    const roll = rollDice(focusDice);
    setLastRoll(roll);
    onRoll(focusDice);
    setIsRolling(false);
    setIsCelebrating(true);
    // Stop celebration after 2 seconds
    setTimeout(() => setIsCelebrating(false), 2000);
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
      {/* Modern Dice Roll Modal */}
      {focusDice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={handleCloseModal}>
          <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 z-10" 
              onClick={handleCloseModal}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="relative p-8 pb-6">
              <div className="flex flex-col items-center">
                {/* Dice Icon */}
                <div className={`relative w-24 h-24 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                  isRolling ? 'animate-bounce scale-110' : 
                  isCelebrating ? 'celebrate glow' : 
                  'float'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl opacity-80"></div>
                  <div className="relative z-10">
                    {focusDice.type === 'standard' ? (
                      (() => {
                        const sides = focusDice.sides as number;
                        const Icon = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6][Math.min(sides - 1, 5)];
                        return <Icon className="w-12 h-12 text-white drop-shadow-lg" />;
                      })()
                    ) : (
                      <Dice1 className="w-12 h-12 text-white drop-shadow-lg" />
                    )}
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl opacity-20 blur-xl"></div>
                </div>

                {/* Dice Info */}
                <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{focusDice.name}</h2>
                <p className="text-white/70 text-sm font-medium">
                  {focusDice.type === 'standard' ? `${focusDice.sides} sides` : `${focusDice.sides.length} values`}
                </p>
              </div>
            </div>

            {/* Roll Button */}
            <div className="px-8 pb-8">
              <button
                onClick={handleRoll}
                disabled={isRolling}
                className={`relative w-full h-20 rounded-2xl border-2 border-white/30 bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white font-bold text-lg flex flex-col items-center justify-center shadow-xl transition-all duration-300 overflow-hidden group ${
                  isRolling 
                    ? 'animate-pulse cursor-not-allowed' 
                    : 'hover:from-blue-500 hover:to-purple-500 hover:scale-105 hover:shadow-2xl active:scale-95'
                }`}
              >
                {/* Background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative z-10 flex items-center space-x-3">
                  {isRolling ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="animate-pulse">Rolling...</span>
                    </>
                  ) : (
                    <>
                      <Dice1 className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />
                      <span>Roll Dice</span>
                    </>
                  )}
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </div>

            {/* Result Display */}
            {lastRoll && (
              <div className="px-8 pb-8">
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30">
                  <div className="text-center">
                    <div className="text-white/80 text-sm font-medium mb-2">Result</div>
                    <div className={`text-5xl font-bold text-white mb-2 drop-shadow-lg ${isCelebrating ? 'animate-pulse' : ''}`}>
                      {lastRoll.result}
                    </div>
                    <div className="text-white/60 text-xs">
                      {new Date(lastRoll.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  {/* Celebration particles */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-2 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                    <div className="absolute top-4 right-6 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                    <div className="absolute bottom-4 left-6 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                    <div className="absolute bottom-2 right-4 w-2 h-2 bg-green-400 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Roll Again Button */}
            {lastRoll && (
              <div className="px-8 pb-8">
                <button
                  onClick={handleRoll}
                  disabled={isRolling}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-200 border border-white/20 hover:border-white/40"
                >
                  Roll Again
                </button>
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