'use client';

import React, { useState } from 'react';
import { RollResult } from '@/types/dice';
import { storage } from '@/utils/storage';
import { Trash2, Clock } from 'lucide-react';

interface RollHistoryProps {
  rolls: RollResult[];
}

export function RollHistory({ rolls }: RollHistoryProps) {
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const handleClearHistory = () => {
    storage.saveRollHistory([]);
    setShowConfirmClear(false);
    // Force a page reload to update the UI
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Roll History</h2>
        {rolls.length > 0 && (
          <button
            onClick={() => setShowConfirmClear(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Confirm Clear Dialog */}
      {showConfirmClear && (
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-white mb-4">Are you sure you want to clear all roll history?</p>
          <div className="flex gap-2">
            <button
              onClick={handleClearHistory}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => setShowConfirmClear(false)}
              className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Roll History List */}
      <div className="space-y-2">
        {rolls.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No rolls yet</p>
            <p className="text-sm">Start rolling dice to see your history!</p>
          </div>
        ) : (
          rolls.map((roll) => (
            <div
              key={roll.id}
              className="bg-gray-700 rounded-lg p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">
                  {typeof roll.result === 'number' ? roll.result : roll.result.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white">{roll.diceName}</div>
                  <div className="text-sm text-gray-400">
                    {typeof roll.result === 'number' ? `Rolled ${roll.result}` : `Got ${roll.result}`}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimestamp(roll.timestamp)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistics */}
      {rolls.length > 0 && (
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-md font-semibold text-white mb-3">Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Total Rolls</div>
              <div className="text-white font-semibold">{rolls.length}</div>
            </div>
            <div>
              <div className="text-gray-400">Today&apos;s Rolls</div>
              <div className="text-white font-semibold">
                {rolls.filter(roll => {
                  const today = new Date();
                  const rollDate = new Date(roll.timestamp);
                  return today.toDateString() === rollDate.toDateString();
                }).length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 