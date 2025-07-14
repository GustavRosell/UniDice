'use client';

import React, { useState } from 'react';
import { StandardDice, CustomDice, RollResult } from '@/types/dice';
import { rollDice } from '@/utils/diceUtils';
import { storage } from '@/utils/storage';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';
import { CreateDiceModal } from './CreateDiceModal';
import Image from 'next/image';

interface DiceRollerProps {
  dice: (StandardDice | CustomDice)[];
  onRoll: (dice: StandardDice | CustomDice) => void;
  onCustomDiceChange?: (dice: CustomDice[]) => void;
  showCustom?: boolean;
  onToggleView?: () => void;
}

// AnimatedDiceFace component
function AnimatedDiceFace({ value, isRolling, dice }: { value: string | number; isRolling: boolean; dice: StandardDice | CustomDice }) {
  // For standard dice 1-6, show dots; for >6, show number; for color dice, show color
  const isColorDice = dice.type === 'custom' && dice.sides.every(s => /^#([0-9A-F]{3}){1,2}$/i.test(s) || /^rgb|hsl|\w+$/i.test(s));

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
      <span className="text-white font-extrabold text-5xl drop-shadow-lg select-none">
        {value}
      </span>
    </div>
  );
}

export function DiceRoller({ dice, onRoll, onCustomDiceChange, showCustom, onToggleView }: DiceRollerProps) {
  const [focusDice, setFocusDice] = useState<StandardDice | CustomDice | null>(null);
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
    await new Promise(resolve => setTimeout(resolve, 900));
    const roll = rollDice(focusDice);
    setLastRoll(roll);
    onRoll(focusDice);
    setIsRolling(false);
  };

  const handleCreateDice = (data: { name: string; type: 'numbers' | 'colors'; min?: number; max?: number; colors?: string[] }) => {
    if (!onCustomDiceChange) return;
    if (!data.name.trim()) return;
    
    const currentCustomDice = storage.getCustomDice();
    
    let newDice: CustomDice;
    let id: string;
    if (data.type === 'numbers') {
      const min = data.min ?? 1;
      const max = data.max ?? 6;
      const sides = Array.from({ length: max - min + 1 }, (_, i) => String(i + min));
      id = 'custom-' + data.name.trim().replace(/\s+/g, '-').toLowerCase() + '-' + sides.join('-');
      newDice = {
        id,
        type: 'custom',
        name: data.name,
        sides,
        color: '#8884FF',
        diceSubType: 'numbers',
      };
    } else {
      const sides = data.colors ?? [];
      id = 'custom-' + data.name.trim().replace(/\s+/g, '-').toLowerCase() + '-' + sides.join('-');
      newDice = {
        id,
        type: 'custom',
        name: data.name,
        sides,
        color: (data.colors && data.colors[0]) || '#8884FF',
        diceSubType: 'colors',
      };
    }
    
    // Add the new dice to the existing list
    onCustomDiceChange([...currentCustomDice, newDice]);
  };

  const handleDeleteCustomDice = (id: string) => {
    if (!onCustomDiceChange) return;
    const currentCustomDice = dice.filter(d => d.type === 'custom') as CustomDice[];
    onCustomDiceChange(currentCustomDice.filter(d => d.id !== id));
  };

  // In renderDiceButton, always return a wrapper div for both standard and custom dice
  const renderDiceButton = (dice: StandardDice | CustomDice) => {
    const wrapperClass = "flex items-center justify-center w-32 h-32 rounded-xl border-2 border-white/30 bg-gradient-to-br from-white/5 to-white/10 shadow-xl";
    if (dice.type === 'standard') {
      // Render standard dice with icons
      const sides = dice.sides as number;
      let iconComponents: React.ReactElement[] = [];
      let iconSize = 52; // Smaller for tighter layout
      let layoutClass = 'flex justify-center items-center w-32 h-32';
      let numIcons = 1;
      let pips = sides;

      // Special case for D20: use grid layout with gap-1 for consistent spacing
      if (sides === 20) {
        const IconComponent = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6][4]; // 5th icon for D20
        iconSize = 40;
        const icons = [0, 1, 2, 3].map(i => <IconComponent key={i} size={iconSize} />);
        return (
          <div key={dice.id} className={wrapperClass}>
            <button
              onClick={() => handleOpenModal(dice)}
              className="dice-button w-full h-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 hover:bg-white/10 transform hover:scale-105 active:scale-95 transition-transform duration-150 bg-transparent border-none shadow-none"
              style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
            >
              <div className="grid grid-cols-2 gap-0 w-20 h-20 items-center justify-center place-items-center">
                {icons}
              </div>
            </button>
          </div>
        );
      }
      if (sides <= 6) {
        const Icon = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6][sides - 1];
        iconComponents = [<Icon key={0} size={iconSize} />];
      } else {
        if (sides === 8) {
          numIcons = 2;
          pips = 4;
          iconSize = 40;
        } else if (sides === 10) {
          numIcons = 2;
          pips = 5;
          iconSize = 40;
        } else if (sides === 12) {
          numIcons = 2;
          pips = 6;
          iconSize = 40;
        } else if (sides === 100) {
          numIcons = 10;
          pips = 6;
          iconSize = 20;
          layoutClass = 'grid grid-cols-5 gap-0.5 w-28 h-28 items-center justify-center place-items-center h-full w-full';
        } else {
          return null;
        }
        if (numIcons === 2) {
          layoutClass = 'flex flex-row justify-center items-center gap-0.5 w-28 h-28';
        }
        const Icon = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6][pips - 1];
        iconComponents = Array.from({ length: numIcons }, (_, i) => <Icon key={i} size={iconSize} />);
      }

      return (
        <div key={dice.id} className={wrapperClass}>
          <button
            onClick={() => handleOpenModal(dice)}
            className="dice-button w-full h-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 hover:bg-white/10 transform hover:scale-105 active:scale-95 transition-transform duration-150 bg-transparent border-none shadow-none"
            style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
          >
            <div className={layoutClass}>
              {iconComponents}
            </div>
          </button>
        </div>
      );
    }
    // Render custom dice
    const isNumberDice = (dice as CustomDice).diceSubType === 'numbers';
    const isColorDice = (dice as CustomDice).diceSubType === 'colors';
    return (
      <div key={dice.id} className={wrapperClass + " relative group"}>
        <button
          onClick={() => handleOpenModal(dice)}
          className="dice-button w-full h-full flex flex-col items-center justify-center text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 hover:bg-white/10 transform hover:scale-105 active:scale-95 transition-transform duration-150 bg-transparent border-none shadow-none relative"
          style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
        >
          {/* Delete X button, only for custom dice, inside the box, not a <button> */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Delete Dice"
            className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 transition-colors duration-150 shadow-md z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
            style={{ pointerEvents: 'auto' }}
            title="Delete Dice"
            onClick={e => { e.stopPropagation(); handleDeleteCustomDice(dice.id); }}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); handleDeleteCustomDice(dice.id); } }}
          >
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
            </svg>
          </div>
          {isColorDice ? (
            <div className="w-10 h-10 rounded-full mb-2" style={{ background: dice.sides[0] as string }} />
          ) : isNumberDice ? (
            <div className="w-10 h-10 flex items-center justify-center mb-2">
              <Image src="/Icon.png" alt="Dice Icon" width={40} height={40} style={{ objectFit: 'contain' }} />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20">
              <span className="text-white font-bold text-base">{dice.sides[0]}</span>
            </div>
          )}
          <span className="font-semibold text-white text-xs text-center">{dice.name}</span>
        </button>
      </div>
    );
  };

  // Render dice buttons based on current view
  const diceButtons = dice.map(renderDiceButton).filter(Boolean);

  // Standardized grid and container styles for perfect alignment
  const GRID_WIDTH = 'w-[264px]'; // 2 * 8rem (w-32) + gap-2 (16px)
  const GRID_GAP = 'gap-2';
  const GRID_COLS = 'grid-cols-2';
  const GRID_STYLE = `${GRID_WIDTH} grid ${GRID_COLS} ${GRID_GAP} place-items-center custom-scrollbar`;

  // Create the toggle buttons
  const myDiceButton = (
    <button
      key="my-dice"
      onClick={onToggleView}
      className="w-32 h-32 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg text-white hover:bg-gradient-to-br hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
    >
      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
      </svg>
      <span className="text-sm font-medium">{showCustom ? 'Regular Dice' : 'My Dice'}</span>
    </button>
  );

  const createDiceButton = (
    <button
      key="create-dice"
      onClick={() => setShowCreateModal(true)}
      className="w-32 h-32 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-pink-500 rounded-lg text-white hover:bg-gradient-to-br hover:from-blue-600 hover:to-pink-600 transition-all duration-200"
    >
      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span className="text-sm font-medium">Create Dice</span>
    </button>
  );

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto">
      <div className="mx-auto mt-1 flex items-center justify-center h-24 w-[264px]">
        <Image src="/Icon+Logo.png" alt="UniDice Logo" width={220} height={80} className="object-contain -translate-x-4" />
      </div>
      
      {/* Dice grid (scrollable if custom dice) */}
      <div className={`h-[440px] ${showCustom ? 'overflow-y-auto' : 'overflow-hidden'} hide-scrollbar px-4 pt-0 pb-1`}>
        <div className={`${GRID_STYLE} mx-auto`}>
          {diceButtons}
        </div>
      </div>

      {/* Action buttons (bottom row, always visible) */}
      <div className="px-4 pb-8 pt-0">
            <div className={`${GRID_STYLE} mx-auto`}>
              {myDiceButton}
              {createDiceButton}
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
    </div>
  );
}
