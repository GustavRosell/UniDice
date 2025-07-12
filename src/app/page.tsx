'use client';

import React, { useState, useEffect } from 'react';
import { DiceRoller } from '@/components/DiceRoller';
import { GameTemplates } from '@/components/GameTemplates';
import { BottomNav } from '@/components/BottomNav';
import { StandardDice, CustomDice } from '@/types/dice';
import { standardDice } from '@/utils/diceUtils';
import { storage } from '@/utils/storage';

type Tab = 'roll' | 'games' | 'settings';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('roll');
  const [customDice, setCustomDice] = useState<CustomDice[]>([]);
  const [showCustom, setShowCustom] = useState(false); // toggle between standard and custom dice

  useEffect(() => {
    setCustomDice(storage.getCustomDice());
  }, []);

  const handleCustomDiceChange = (dice: CustomDice[]) => {
    setCustomDice(dice);
    storage.saveCustomDice(dice);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-800 to-pink-700 relative">
      <div className="w-full max-w-md flex-1 flex flex-col items-center justify-center px-4 pb-24">
        <main className="w-full flex-1 flex flex-col items-center justify-center">
          {activeTab === 'roll' && (
            <DiceRoller
              dice={showCustom ? customDice : standardDice}
              onRoll={() => {}}
              onCustomDiceChange={handleCustomDiceChange}
              showCustom={showCustom}
              onToggleView={() => setShowCustom(!showCustom)}
            />
          )}
          {activeTab === 'games' && <GameTemplates />}
          {activeTab === 'settings' && <div className="text-white text-center py-12">Settings (coming soon)</div>}
        </main>
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
} 