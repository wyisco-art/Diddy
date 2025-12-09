export interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
  revealedBy?: string;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  score: number;
}

export interface GameState {
  id: string;
  board: Cell[][];
  players: Player[];
  gameStatus: 'waiting' | 'playing' | 'won' | 'lost';
  width: number;
  height: number;
  mineCount: number;
  startTime?: number;
}

export interface ClientEvents {
  'join-game': (data: { playerName: string; gameId?: string }) => void;
  'reveal-cell': (data: { row: number; col: number }) => void;
  'flag-cell': (data: { row: number; col: number }) => void;
  'new-game': (data: { width: number; height: number; mineCount: number }) => void;
}

export interface ServerEvents {
  'game-state': (state: GameState) => void;
  'player-joined': (player: Player) => void;
  'player-left': (playerId: string) => void;
  'cell-revealed': (data: { row: number; col: number; cell: Cell }) => void;
  'game-over': (data: { status: 'won' | 'lost'; winner?: Player }) => void;
  error: (message: string) => void;
}
