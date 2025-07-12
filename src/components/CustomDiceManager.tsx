'use client';

import React, { useState } from 'react';
import { CustomDice } from '@/types/dice';
import { createCustomDice, validateCustomDice, rollDice } from '@/utils/diceUtils';
import { Plus, Trash2, Palette } from 'lucide-react';

interface CustomDiceManagerProps {
  customDice: CustomDice[];
  onDiceChange: (dice: CustomDice[]) => void;
}

const colorOptions = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'
];

// AnimatedDiceFace component for custom dice
function AnimatedDiceFace({ value, isRolling, dice }: { value: string | number; isRolling: boolean; dice: CustomDice }) {
  const isColorDice = dice.sides.every(s => /^#([0-9A-F]{3}){1,2}$/i.test(s) || /^rgb|hsl|\w+$/i.test(s));

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

  // Number/text dice: show the value
  return (
    <div
      className={`relative w-32 h-32 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white/30 bg-gradient-to-br from-indigo-500 to-purple-600 transition-all duration-300 select-none ${isRolling ? 'animate-spin-slow scale-110' : 'scale-100'}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <span className="text-white font-extrabold text-4xl drop-shadow-lg select-none">
        {value}
      </span>
    </div>
  );
}

export function CustomDiceManager({ customDice, onDiceChange }: CustomDiceManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState<'numbers' | 'colors'>('numbers');
  const [focusDice, setFocusDice] = useState<CustomDice | null>(null);
  const [lastRoll, setLastRoll] = useState<string | number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    sides: ['', ''],
    color: '#3b82f6',
    colors: ['#ef4444', '#3b82f6']
  });
  const [error, setError] = useState<string | null>(null);

  const handleAddSide = () => {
    setFormData(prev => ({
      ...prev,
      sides: [...prev.sides, '']
    }));
  };

  const handleRemoveSide = (index: number) => {
    if (formData.sides.length > 2) {
      setFormData(prev => ({
        ...prev,
        sides: prev.sides.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSideChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      sides: prev.sides.map((side, i) => i === index ? value : side)
    }));
  };

  const handleAddColor = (color: string) => {
    if (!formData.colors.includes(color)) {
      setFormData(prev => ({ ...prev, colors: [...prev.colors, color] }));
    }
  };

  const handleRemoveColor = (index: number) => {
    if (formData.colors.length > 2) {
      setFormData(prev => ({
        ...prev,
        colors: prev.colors.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = () => {
    let newDice;
    if (tab === 'numbers') {
      const validationError = validateCustomDice(formData.name, formData.sides);
      if (validationError) {
        setError(validationError);
        return;
      }
      newDice = createCustomDice(formData.name, formData.sides, formData.color);
    } else {
      if (!formData.name.trim()) {
        setError('Dice name is required');
        return;
      }
      if (formData.colors.length < 2) {
        setError('At least 2 colors required');
        return;
      }
      newDice = createCustomDice(formData.name, formData.colors, '#888');
    }
    onDiceChange([...customDice, newDice]);
    setFormData({ name: '', sides: ['', ''], color: '#3b82f6', colors: ['#ef4444', '#3b82f6'] });
    setShowModal(false);
    setError(null);
    setTab('numbers');
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setTab('numbers');
    setFormData({ name: '', sides: ['', ''], color: '#3b82f6', colors: ['#ef4444', '#3b82f6'] });
    setError(null);
  };

  const handleOpenRollModal = (dice: CustomDice) => {
    setFocusDice(dice);
    setLastRoll(null);
  };

  const handleCloseRollModal = () => {
    setFocusDice(null);
    setLastRoll(null);
  };

  const handleRoll = async () => {
    if (!focusDice) return;
    setIsRolling(true);
    await new Promise(resolve => setTimeout(resolve, 900));
    const roll = rollDice(focusDice);
    setLastRoll(roll.result);
    setIsRolling(false);
  };

  // Custom dice grid
  return (
    <>
      <div className="flex flex-col items-center w-full">
        <div className="flex items-center justify-between w-full mb-4">
          <h2 className="text-2xl font-bold text-white">Custom Dice</h2>
          <button
            onClick={handleOpenModal}
            className="ml-2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 shadow-lg border border-white/20"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6 w-full mb-8">
          {customDice.length === 0 ? (
            <div className="col-span-2 text-center text-white/60 py-8">
              <Palette className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No custom dice yet</p>
              <p className="text-sm">Create your first custom dice above!</p>
            </div>
          ) : (
            customDice.map((dice) => (
              <button
                key={dice.id}
                onClick={() => handleOpenRollModal(dice)}
                className="dice-button w-28 h-28 flex flex-col items-center justify-center text-white text-lg font-bold select-none hover:bg-white/30 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20" >
                  <Palette className="w-8 h-8" />
                </div>
                <span className="font-semibold text-white text-base">{dice.name}</span>
              </button>
            ))
          )}
        </div>
      </div>
      {/* Custom Dice Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-3 right-3 text-white/60 hover:text-white text-2xl" onClick={() => setShowModal(false)}>&times;</button>
            <h3 className="text-xl font-bold text-white mb-4">Create Custom Dice</h3>
            <div className="flex mb-4">
              <button
                className={`flex-1 py-2 rounded-l-lg ${tab === 'numbers' ? 'bg-white/20 text-white font-bold' : 'bg-white/5 text-white/60'}`}
                onClick={() => setTab('numbers')}
              >
                Numbers
              </button>
              <button
                className={`flex-1 py-2 rounded-r-lg ${tab === 'colors' ? 'bg-white/20 text-white font-bold' : 'bg-white/5 text-white/60'}`}
                onClick={() => setTab('colors')}
              >
                Colors
              </button>
            </div>
            {/* Numbers Tab */}
            {tab === 'numbers' && (
              <>
                <label className="block text-sm font-medium text-white mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field mb-4"
                  placeholder="e.g., Decision Dice"
                />
                <label className="block text-sm font-medium text-white mb-2">Sides</label>
                <div className="space-y-2 mb-4">
                  {formData.sides.map((side, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={side}
                        onChange={e => handleSideChange(index, e.target.value)}
                        className="input-field"
                        placeholder={`Side ${index + 1}`}
                      />
                      {formData.sides.length > 2 && (
                        <button
                          onClick={() => handleRemoveSide(index)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={handleAddSide}
                    className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Side
                  </button>
                </div>
                <label className="block text-sm font-medium text-white mb-2">Color</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === color ? 'border-white scale-110' : 'border-white/30 hover:border-white/60'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </>
            )}
            {/* Colors Tab */}
            {tab === 'colors' && (
              <>
                <label className="block text-sm font-medium text-white mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field mb-4"
                  placeholder="e.g., Color Dice"
                />
                <label className="block text-sm font-medium text-white mb-2">Colors</label>
                <div className="space-y-2 mb-4">
                  {formData.colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border-2 border-white/40" style={{ backgroundColor: color }} />
                      <span className="text-white/80">{color}</span>
                      {formData.colors.length > 2 && (
                        <button
                          onClick={() => handleRemoveColor(index)}
                          className="text-red-400 hover:text-red-600 text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleAddColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${formData.colors.includes(color) ? 'border-white scale-110 opacity-60' : 'border-white/30 hover:border-white/60'}`}
                        style={{ backgroundColor: color }}
                        disabled={formData.colors.includes(color)}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
            {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSubmit}
                className="btn-primary flex-1"
              >
                Create Dice
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Custom Dice Roll Modal */}
      {focusDice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl" onClick={handleCloseRollModal}>
          <div
            className="relative w-full max-w-lg mx-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col items-center justify-center py-12 px-4"
            style={{ minHeight: 420 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 z-10"
              onClick={handleCloseRollModal}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Animated Dice Face */}
            <div className="flex flex-col items-center w-full">
              <AnimatedDiceFace
                value={isRolling ? '?' : lastRoll ? lastRoll : focusDice.sides.length > 0 ? focusDice.sides[0] : ''}
                isRolling={isRolling}
                dice={focusDice}
              />
              {/* Dice name and info */}
              <div className="text-center mb-8 mt-8">
                <div className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{focusDice.name}</div>
                <div className="text-white/70 text-base font-medium">
                  {focusDice.sides.length} values
                </div>
              </div>
              {/* Roll Button */}
              <button
                onClick={handleRoll}
                disabled={isRolling}
                className={`w-full max-w-xs h-16 rounded-2xl border-2 border-white/30 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white font-bold text-lg flex items-center justify-center shadow-xl transition-all duration-300 overflow-hidden group mb-2 ${
                  isRolling
                    ? 'animate-pulse cursor-not-allowed' 
                    : 'hover:from-indigo-500 hover:to-purple-500 hover:scale-105 hover:shadow-2xl active:scale-95'
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
    </>
  );
} 