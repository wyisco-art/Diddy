import { useState, useEffect } from 'react';
import socket from './socket';
import { GameState, Player } from './types';
import Board from './components/Board';
import PlayerList from './components/PlayerList';
import GameControls from './components/GameControls';
import './App.css';

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [connected, setConnected] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [joined, setJoined] = useState(false);
  const [gameOver, setGameOver] = useState<{ status: 'won' | 'lost'; winner?: Player } | null>(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    socket.on('game-state', (state) => {
      console.log('Game state updated', state);
      setGameState(state);
    });

    socket.on('player-joined', (player) => {
      console.log('Player joined:', player);
    });

    socket.on('player-left', (playerId) => {
      console.log('Player left:', playerId);
    });

    socket.on('game-over', (data) => {
      console.log('Game over:', data);
      setGameOver(data);
    });

    socket.on('error', (message) => {
      console.error('Error:', message);
      alert(`Error: ${message}`);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('game-state');
      socket.off('player-joined');
      socket.off('player-left');
      socket.off('game-over');
      socket.off('error');
    };
  }, []);

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    socket.connect();
    socket.emit('join-game', { playerName: playerName.trim() });
    setJoined(true);
  };

  const handleCellClick = (row: number, col: number, isRightClick: boolean) => {
    if (!gameState || gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') return;

    if (isRightClick) {
      socket.emit('flag-cell', { row, col });
    } else {
      socket.emit('reveal-cell', { row, col });
    }
  };

  const handleNewGame = (width: number, height: number, mineCount: number) => {
    socket.emit('new-game', { width, height, mineCount });
    setGameOver(null);
  };

  if (!joined) {
    return (
      <div className="app">
        <div className="login-container">
          <h1>Multiplayer Minesweeper</h1>
          <form onSubmit={handleJoinGame}>
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
              autoFocus
            />
            <button type="submit">Join Game</button>
          </form>
        </div>
      </div>
    );
  }

  if (!connected || !gameState) {
    return (
      <div className="app">
        <div className="loading">Connecting to game...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="game-container">
        <header>
          <h1>Multiplayer Minesweeper</h1>
          <div className="game-info">
            <span>Room: {gameState.id}</span>
            <span>Mines: {gameState.mineCount}</span>
            <span className={`status status-${gameState.gameStatus}`}>
              {gameState.gameStatus.toUpperCase()}
            </span>
          </div>
        </header>

        <div className="game-content">
          <div className="left-panel">
            <PlayerList players={gameState.players} myId={socket.id || ''} />
            <GameControls onNewGame={handleNewGame} />
          </div>

          <div className="board-container">
            <Board
              board={gameState.board}
              players={gameState.players}
              onCellClick={handleCellClick}
              gameStatus={gameState.gameStatus}
            />
          </div>
        </div>

        {gameOver && (
          <div className="game-over-modal">
            <div className="modal-content">
              <h2>{gameOver.status === 'won' ? '🎉 Game Won!' : '💥 Game Over!'}</h2>
              {gameOver.winner && (
                <p>
                  Winner: <span style={{ color: gameOver.winner.color }}>
                    {gameOver.winner.name}
                  </span> ({gameOver.winner.score} cells)
                </p>
              )}
              <button onClick={() => setGameOver(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
