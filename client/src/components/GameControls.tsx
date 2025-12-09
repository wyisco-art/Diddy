import { useState } from 'react';
import './GameControls.css';

interface GameControlsProps {
  onNewGame: (width: number, height: number, mineCount: number) => void;
}

const presets = [
  { name: 'Easy', width: 9, height: 9, mineCount: 10 },
  { name: 'Medium', width: 16, height: 16, mineCount: 40 },
  { name: 'Hard', width: 30, height: 16, mineCount: 99 },
];

function GameControls({ onNewGame }: GameControlsProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [width, setWidth] = useState(16);
  const [height, setHeight] = useState(16);
  const [mineCount, setMineCount] = useState(40);

  const handlePresetClick = (preset: typeof presets[0]) => {
    onNewGame(preset.width, preset.height, preset.mineCount);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const maxMines = Math.floor(width * height * 0.8);
    const validMineCount = Math.min(Math.max(1, mineCount), maxMines);
    onNewGame(width, height, validMineCount);
    setShowCustom(false);
  };

  return (
    <div className="game-controls">
      <h3>New Game</h3>
      <div className="presets">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handlePresetClick(preset)}
            className="preset-button"
          >
            {preset.name}
            <span className="preset-info">
              {preset.width}x{preset.height} ({preset.mineCount} mines)
            </span>
          </button>
        ))}
      </div>
      <button
        onClick={() => setShowCustom(!showCustom)}
        className="custom-toggle"
      >
        {showCustom ? 'Hide Custom' : 'Custom Game'}
      </button>
      {showCustom && (
        <form onSubmit={handleCustomSubmit} className="custom-form">
          <div className="form-group">
            <label>Width:</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min={5}
              max={50}
            />
          </div>
          <div className="form-group">
            <label>Height:</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min={5}
              max={50}
            />
          </div>
          <div className="form-group">
            <label>Mines:</label>
            <input
              type="number"
              value={mineCount}
              onChange={(e) => setMineCount(Number(e.target.value))}
              min={1}
              max={Math.floor(width * height * 0.8)}
            />
          </div>
          <button type="submit">Start</button>
        </form>
      )}
    </div>
  );
}

export default GameControls;
