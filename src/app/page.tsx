'use client';

import React, { useState, useEffect } from 'react';
import { DiceRoller } from '@/components/DiceRoller';
import { CustomDiceManager } from '@/components/CustomDiceManager';
import { RollHistory } from '@/components/RollHistory';
import { GameTemplates } from '@/components/GameTemplates';
import { BottomNav } from '@/components/BottomNav';
import { StandardDice, CustomDice, RollResult } from '@/types/dice';
import { standardDice, rollDice } from '@/utils/diceUtils';
import { storage } from '@/utils/storage';

type Tab = 'roll' | 'custom' | 'history' | 'games';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('roll');
  const [customDice, setCustomDice] = useState<CustomDice[]>([]);
  const [rollHistory, setRollHistory] = useState<RollResult[]>([]);

  useEffect(() => {
    setCustomDice(storage.getCustomDice());
    setRollHistory(storage.getRollHistory());
  }, []);

  const handleRoll = (dice: StandardDice | CustomDice) => {
    const roll = rollDice(dice);
    const newHistory = [roll, ...rollHistory];
    setRollHistory(newHistory);
    storage.saveRollHistory(newHistory);
  };

  const handleCustomDiceChange = (dice: CustomDice[]) => {
    setCustomDice(dice);
    storage.saveCustomDice(dice);
  };

  const allDice = [...standardDice, ...customDice];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-800 to-pink-700 relative">
      <div className="w-full max-w-md flex-1 flex flex-col items-center justify-center px-4 pb-24">
        <main className="w-full flex-1 flex flex-col items-center justify-center">
          {activeTab === 'roll' && (
            <DiceRoller dice={allDice} onRoll={handleRoll} onCustomDiceChange={handleCustomDiceChange} />
          )}
          {activeTab === 'custom' && (
            <CustomDiceManager 
              customDice={customDice} 
              onDiceChange={handleCustomDiceChange} 
            />
          )}
          {activeTab === 'history' && (
            <RollHistory rolls={rollHistory} />
          )}
          {activeTab === 'games' && (
            <GameTemplates />
          )}
        </main>
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
} 