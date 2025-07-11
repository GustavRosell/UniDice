'use client';

interface NavigationProps {
  activeTab: 'roll' | 'custom' | 'history' | 'games';
  onTabChange: (tab: 'roll' | 'custom' | 'history' | 'games') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'roll' as const, label: 'Roll', icon: '🎲' },
    { id: 'custom' as const, label: 'Custom', icon: '⚙️' },
    { id: 'history' as const, label: 'History', icon: '🕑' },
    { id: 'games' as const, label: 'Games', icon: '🎮' },
  ];

  return (
    <nav className="bg-gray-700 border-b border-gray-600">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center py-3 px-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-blue-400 bg-gray-600 border-b-2 border-blue-400'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600'
              }`}
            >
              <span className="text-xl mb-1">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
} 