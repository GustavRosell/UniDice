import React from 'react';
import { Dice1, Settings, History, Gamepad2, Dice6 } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'roll' | 'custom' | 'history' | 'games';
  onTabChange: (tab: 'roll' | 'custom' | 'history' | 'games') => void;
}

const tabs = [
  { id: 'roll' as const, label: 'Dice', icon: <Dice6 className="w-6 h-6" /> },
  { id: 'custom' as const, label: 'Custom', icon: <Settings className="w-6 h-6" /> },
  { id: 'games' as const, label: 'Games', icon: <Gamepad2 className="w-6 h-6" /> },
  { id: 'history' as const, label: 'History', icon: <History className="w-6 h-6" /> },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-t border-white/20 shadow-lg">
      <div className="flex justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center flex-1 py-2 transition-colors ${
                isActive ? 'text-white font-bold' : 'text-white/60 hover:text-white'
              }`}
            >
              {tab.icon}
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
} 