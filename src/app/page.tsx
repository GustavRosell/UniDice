'use client';

import { useState, useEffect } from 'react';
import { DiceRoller } from '@/components/DiceRoller';
import { CustomDiceManager } from '@/components/CustomDiceManager';
import { RollHistory } from '@/components/RollHistory';
import { GameTemplates } from '@/components/GameTemplates';
import { Navigation } from '@/components/Navigation';
import { StandardDice, CustomDice } from '@/types/dice';
import { standardDice } from '@/utils/diceUtils';
import { storage } from '@/utils/storage';

type Tab = 'roll' | 'custom' | 'history' | 'games';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('roll');
  const [customDice, setCustomDice] = useState<CustomDice[]>([]);
  const [rollHistory, setRollHistory] = useState<any[]>([]);

  useEffect(() => {
    // Load data from localStorage
    setCustomDice(storage.getCustomDice());
    setRollHistory(storage.getRollHistory());
  }, []);

  const handleRoll = (dice: StandardDice | CustomDice) => {
    // The roll is already handled in the DiceRoller component
    // This function is called after the roll is made
  };

  const handleCustomDiceChange = (dice: CustomDice[]) => {
    setCustomDice(dice);
    storage.saveCustomDice(dice);
  };

  const allDice = [...standardDice, ...customDice];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-md mx-auto bg-gray-800 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-gray-700 p-4 text-center">
          <h1 className="text-2xl font-bold text-white">🎲 Dice Roller</h1>
        </header>

        {/* Navigation */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <main className="flex-1 p-4">
          {activeTab === 'roll' && (
            <DiceRoller dice={allDice} onRoll={handleRoll} />
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
    </div>
  );
} 