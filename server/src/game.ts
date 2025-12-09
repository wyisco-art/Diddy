import { Cell, GameState, Player } from './types';

export class MinesweeperGame {
  private board: Cell[][];
  private players: Map<string, Player>;
  private gameStatus: 'waiting' | 'playing' | 'won' | 'lost' = 'waiting';
  private width: number;
  private height: number;
  private mineCount: number;
  private firstMove = true;
  private revealedCells = 0;

  constructor(
    public id: string,
    width = 16,
    height = 16,
    mineCount = 40
  ) {
    this.width = width;
    this.height = height;
    this.mineCount = mineCount;
    this.board = this.initializeBoard();
    this.players = new Map();
  }

  private initializeBoard(): Cell[][] {
    const board: Cell[][] = [];
    for (let row = 0; row < this.height; row++) {
      board[row] = [];
      for (let col = 0; col < this.width; col++) {
        board[row][col] = {
          row,
          col,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        };
      }
    }
    return board;
  }

  private placeMines(avoidRow: number, avoidCol: number): void {
    let minesPlaced = 0;
    const avoidCells = this.getNeighbors(avoidRow, avoidCol);
    avoidCells.push(this.board[avoidRow][avoidCol]);

    while (minesPlaced < this.mineCount) {
      const row = Math.floor(Math.random() * this.height);
      const col = Math.floor(Math.random() * this.width);
      const cell = this.board[row][col];

      if (!cell.isMine && !avoidCells.includes(cell)) {
        cell.isMine = true;
        minesPlaced++;
      }
    }

    this.calculateNeighborMines();
  }

  private calculateNeighborMines(): void {
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        if (!this.board[row][col].isMine) {
          const neighbors = this.getNeighbors(row, col);
          this.board[row][col].neighborMines = neighbors.filter(
            (cell) => cell.isMine
          ).length;
        }
      }
    }
  }

  private getNeighbors(row: number, col: number): Cell[] {
    const neighbors: Cell[] = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const newRow = row + dr;
        const newCol = col + dc;
        if (
          newRow >= 0 &&
          newRow < this.height &&
          newCol >= 0 &&
          newCol < this.width
        ) {
          neighbors.push(this.board[newRow][newCol]);
        }
      }
    }
    return neighbors;
  }

  addPlayer(id: string, name: string): Player {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
    const color = colors[this.players.size % colors.length];

    const player: Player = {
      id,
      name,
      color,
      score: 0,
    };

    this.players.set(id, player);
    return player;
  }

  removePlayer(id: string): void {
    this.players.delete(id);
  }

  revealCell(row: number, col: number, playerId: string): { revealed: Cell[]; gameOver: boolean } {
    if (this.gameStatus === 'won' || this.gameStatus === 'lost') {
      return { revealed: [], gameOver: true };
    }

    if (this.firstMove) {
      this.placeMines(row, col);
      this.firstMove = false;
      this.gameStatus = 'playing';
    }

    const cell = this.board[row][col];

    if (cell.isRevealed || cell.isFlagged) {
      return { revealed: [], gameOver: false };
    }

    const revealed: Cell[] = [];

    if (cell.isMine) {
      this.revealAllMines();
      this.gameStatus = 'lost';
      return { revealed: [cell], gameOver: true };
    }

    this.revealCellRecursive(row, col, playerId, revealed);

    const player = this.players.get(playerId);
    if (player) {
      player.score += revealed.length;
    }

    const totalSafeCells = this.width * this.height - this.mineCount;
    if (this.revealedCells >= totalSafeCells) {
      this.gameStatus = 'won';
      return { revealed, gameOver: true };
    }

    return { revealed, gameOver: false };
  }

  private revealCellRecursive(row: number, col: number, playerId: string, revealed: Cell[]): void {
    const cell = this.board[row][col];

    if (cell.isRevealed || cell.isMine || cell.isFlagged) {
      return;
    }

    cell.isRevealed = true;
    cell.revealedBy = playerId;
    revealed.push(cell);
    this.revealedCells++;

    if (cell.neighborMines === 0) {
      const neighbors = this.getNeighbors(row, col);
      for (const neighbor of neighbors) {
        if (!neighbor.isRevealed) {
          this.revealCellRecursive(neighbor.row, neighbor.col, playerId, revealed);
        }
      }
    }
  }

  private revealAllMines(): void {
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        if (this.board[row][col].isMine) {
          this.board[row][col].isRevealed = true;
        }
      }
    }
  }

  toggleFlag(row: number, col: number): boolean {
    const cell = this.board[row][col];
    if (cell.isRevealed) {
      return false;
    }
    cell.isFlagged = !cell.isFlagged;
    return true;
  }

  getState(): GameState {
    return {
      id: this.id,
      board: this.board,
      players: Array.from(this.players.values()),
      gameStatus: this.gameStatus,
      width: this.width,
      height: this.height,
      mineCount: this.mineCount,
    };
  }

  getPublicState(): GameState {
    const publicBoard = this.board.map(row =>
      row.map(cell => ({
        ...cell,
        isMine: cell.isRevealed ? cell.isMine : false,
      }))
    );

    return {
      ...this.getState(),
      board: publicBoard,
    };
  }
}
