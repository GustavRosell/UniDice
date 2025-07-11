import React, { useState, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';

interface CreateDiceModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (dice: { name: string; type: 'numbers' | 'colors'; min?: number; max?: number; colors?: string[] }) => void;
}

export function CreateDiceModal({ open, onClose, onCreate }: CreateDiceModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'numbers' | 'colors'>('numbers');
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(6);
  const [colors, setColors] = useState<string[]>(['#FF0000', '#FFD600', '#2979FF']); // Red, Yellow, Blue
  const [colorInput, setColorInput] = useState('#00C853'); // Green
  const [editColorInput, setEditColorInput] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editingColorIdx, setEditingColorIdx] = useState<number | null>(null);
  const [pickerPosition, setPickerPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const pickerRef = useRef<HTMLDivElement>(null);

  // Drag logic
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const handleDragStart = (e: React.MouseEvent) => {
    // Only start drag if the event is on the handle
    if ((e.target as HTMLElement).dataset.draghandle !== 'true') return;
    setDragging(true);
    setDragStart({ x: e.clientX - pickerPosition.x, y: e.clientY - pickerPosition.y });
  };
  const handleDrag = (e: React.MouseEvent) => {
    if (!dragging || !dragStart) return;
    setPickerPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleDragEnd = () => {
    setDragging(false);
    setDragStart(null);
  };

  // Reset picker position and editColorInput when opening a new picker
  React.useEffect(() => {
    setPickerPosition({ x: 0, y: 0 });
    setEditColorInput(null);
  }, [editingColorIdx, showColorPicker]);

  if (!open) return null;

  const handleAddColor = () => {
    if (!colors.includes(colorInput)) {
      setColors([...colors, colorInput]);
    } else {
      setColors([...colors, colorInput]); // allow duplicates
    }
    setShowColorPicker(false);
    setEditingColorIdx(null);
    // Do not reset colorInput; keep it as the last added color
  };

  const handleEditColor = (idx: number, newColor: string) => {
    setColors(colors.map((c, i) => (i === idx ? newColor : c)));
    setEditColorInput(newColor);
  };

  const handleColorClick = (idx: number, event?: React.MouseEvent) => {
    setEditingColorIdx(idx);
    setEditColorInput(colors[idx]);
    setShowColorPicker(true);
    // Position below swatch (no need for pickerRef)
    // The picker will be absolutely positioned left: 0, top: 100% relative to the swatch row
    setPickerPosition({ x: 0, y: 0 });
  };

  const handleAddColorSwatchClick = (event: React.MouseEvent) => {
    setShowColorPicker(true);
    setEditingColorIdx(null);
    // Position below add swatch (no need for pickerRef)
    setPickerPosition({ x: 0, y: 0 });
  };

  const handleRemoveColor = (idx: number) => {
    setColors(colors.filter((_, i) => i !== idx));
  };

  const handleCreate = () => {
    if (type === 'numbers') {
      onCreate({ name, type, min, max });
    } else {
      onCreate({ name, type, colors });
    }
    onClose();
  };

  // Simple color name mapping
  const colorNameMap: { [hex: string]: string } = {
    '#FF0000': 'Red',
    '#FFD600': 'Yellow',
    '#2979FF': 'Blue',
    '#00C853': 'Green',
    '#FF6B6B': 'Coral',
    '#4ECDC4': 'Turquoise',
    '#45B7D1': 'Sky Blue',
    // Add more as needed
  };
  function getColorName(hex: string) {
    const normalized = hex.toUpperCase();
    return colorNameMap[normalized] || hex.toUpperCase();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card relative flex flex-col items-center px-6 py-6" onClick={e => e.stopPropagation()}>
        <button className="absolute top-3 right-3 text-white/60 hover:text-white text-2xl" onClick={onClose}>&times;</button>
        <form className="w-full max-w-xs flex flex-col gap-4" onSubmit={e => { e.preventDefault(); handleCreate(); }}>
          <h2 className="text-xl font-bold text-white mb-2">Create Custom Dice</h2>
          <label className="text-white/90 text-sm">Name
            <input
              className="w-full mt-1 mb-2 rounded-xl px-4 py-2 bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g., Decision Dice"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </label>
          <div>
            <span className="text-white/90 text-sm">Type</span>
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                className={`flex-1 rounded-xl px-4 py-2 border border-white/20 transition-colors duration-150 ${type === 'numbers' ? 'bg-white/80 text-indigo-900 font-bold shadow-lg' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white/90'}`}
                onClick={() => setType('numbers')}
              >
                Numbers
              </button>
              <button
                type="button"
                className={`flex-1 rounded-xl px-4 py-2 border border-white/20 transition-colors duration-150 ${type === 'colors' ? 'bg-white/80 text-indigo-900 font-bold shadow-lg' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white/90'}`}
                onClick={() => setType('colors')}
              >
                Colors
              </button>
            </div>
          </div>
          {type === 'numbers' ? (
            <div className="flex gap-4">
              <label className="flex-1 text-white/90 text-sm">Min
                <input
                  type="number"
                  className="w-full mt-1 rounded-xl px-4 py-2 bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={min}
                  min={1}
                  onChange={e => setMin(Number(e.target.value))}
                  required
                />
              </label>
              <label className="flex-1 text-white/90 text-sm">Max
                <input
                  type="number"
                  className="w-full mt-1 rounded-xl px-4 py-2 bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={max}
                  min={min}
                  onChange={e => setMax(Number(e.target.value))}
                  required
                />
              </label>
            </div>
          ) : (
            <div>
              <span className="text-white/90 text-sm">Colors</span>
              <div className="flex flex-col gap-2 mt-2">
                {colors.map((color, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg border-2 border-white/30 cursor-pointer"
                        style={{ background: color }}
                        onClick={(e) => {
                          handleColorClick(idx, e);
                        }}
                      />
                      <span className="text-white/80 font-mono">{getColorName(color)}</span>
                      <button type="button" className="ml-auto text-red-400 hover:text-red-300 text-xs" onClick={() => handleRemoveColor(idx)}>Remove</button>
                    </div>
                    {showColorPicker && editingColorIdx === idx && (
                      <div className="mt-2 bg-white/10 rounded-xl p-3 shadow-lg border border-white/20 flex flex-col items-center" style={{ minWidth: 180 }}>
                        <HexColorPicker
                          color={editColorInput ?? colors[idx]}
                          onChange={c => {
                            setEditColorInput(c);
                            handleEditColor(idx, c);
                          }}
                        />
                        <button
                          type="button"
                          className="mt-2 rounded-lg px-3 py-1 bg-white/20 text-white/90 border border-white/20 hover:bg-white/30 transition"
                          onClick={() => { setShowColorPicker(false); setEditingColorIdx(null); }}
                        >
                          Done
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg border-2 border-white/30 cursor-pointer"
                      style={{ background: colorInput }}
                      onClick={(e) => {
                        handleAddColorSwatchClick(e);
                      }}
                    />
                    <button
                      type="button"
                      className="rounded-lg px-3 py-1 bg-white/10 text-white/80 border border-white/20 hover:bg-green-500 hover:text-white transition-colors duration-150"
                      onClick={handleAddColor}
                    >
                      Add Color
                    </button>
                  </div>
                 {showColorPicker && editingColorIdx === null && (
                   <div className="mt-2 bg-white/10 rounded-xl p-3 shadow-lg border border-white/20 flex flex-col items-center" style={{ minWidth: 180 }}>
                     <HexColorPicker color={colorInput} onChange={setColorInput} />
                   </div>
                 )}
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-4 mt-4">
            <button type="submit" className="flex-1 rounded-xl px-4 py-2 bg-white/20 text-white font-bold border border-white/20 hover:bg-green-500 hover:text-white transition-colors duration-150">Create Dice</button>
            <button type="button" className="flex-1 rounded-xl px-4 py-2 bg-white/10 text-white/70 border border-white/20 hover:bg-red-500 hover:text-white transition-colors duration-150" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
} 