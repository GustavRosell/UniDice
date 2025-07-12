import React from 'react';
import { Settings, Gamepad2, Dice6 } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'roll' | 'games' | 'settings';
  onTabChange: (tab: 'roll' | 'games' | 'settings') => void;
}

const tabs = [
  { id: 'roll' as const, label: 'Dice', icon: <Dice6 className="w-6 h-6" /> },
  { id: 'games' as const, label: 'Games', icon: <Gamepad2 className="w-6 h-6" /> },
  { id: 'settings' as const, label: 'Settings', icon: <Settings className="w-6 h-6" /> },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-t border-white/20 shadow-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}
    >
      <div className="flex justify-around max-w-md mx-auto py-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center flex-1 transition-colors ${
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