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
