'use client';

import { useState } from 'react';
import { CustomDice } from '@/types/dice';
import { createCustomDice, validateCustomDice } from '@/utils/diceUtils';
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

export function CustomDiceManager({ customDice, onDiceChange }: CustomDiceManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sides: ['', ''],
    color: '#3b82f6'
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

  const handleSubmit = () => {
    const validationError = validateCustomDice(formData.name, formData.sides);
    if (validationError) {
      setError(validationError);
      return;
    }

    const newDice = createCustomDice(formData.name, formData.sides, formData.color);
    onDiceChange([...customDice, newDice]);
    
    // Reset form
    setFormData({ name: '', sides: ['', ''], color: '#3b82f6' });
    setShowForm(false);
    setError(null);
  };

  const handleDelete = (diceId: string) => {
    onDiceChange(customDice.filter(dice => dice.id !== diceId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Custom Dice</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-gray-700 rounded-lg p-4 space-y-4">
          <h3 className="text-md font-semibold text-white">Create New Dice</h3>
          
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Dice Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-blue-400 focus:outline-none"
              placeholder="e.g., Color Dice, Direction Dice"
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color ? 'border-white scale-110' : 'border-gray-500 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Sides Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sides
            </label>
            <div className="space-y-2">
              {formData.sides.map((side, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={side}
                    onChange={(e) => handleSideChange(index, e.target.value)}
                    className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-blue-400 focus:outline-none"
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
                className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Side
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
            >
              Create Dice
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setError(null);
                setFormData({ name: '', sides: ['', ''], color: '#3b82f6' });
              }}
              className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Custom Dice List */}
      <div className="space-y-3">
        {customDice.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <Palette className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No custom dice yet</p>
            <p className="text-sm">Create your first custom dice above!</p>
          </div>
        ) : (
          customDice.map((dice) => (
            <div
              key={dice.id}
              className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: dice.color }}
                >
                  {dice.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white">{dice.name}</div>
                  <div className="text-sm text-gray-400">
                    {dice.sides.join(', ')}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(dice.id)}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 