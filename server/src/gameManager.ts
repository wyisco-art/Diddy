import { MinesweeperGame } from './game';
import { Player } from './types';

export class GameManager {
  private games: Map<string, MinesweeperGame> = new Map();
  private playerToGame: Map<string, string> = new Map();

  createGame(gameId?: string, width = 16, height = 16, mineCount = 40): MinesweeperGame {
    const id = gameId || this.generateGameId();
    const game = new MinesweeperGame(id, width, height, mineCount);
    this.games.set(id, game);
    return game;
  }

  getGame(gameId: string): MinesweeperGame | undefined {
    return this.games.get(gameId);
  }

  getOrCreateGame(gameId?: string): MinesweeperGame {
    if (gameId && this.games.has(gameId)) {
      return this.games.get(gameId)!;
    }

    const availableGame = Array.from(this.games.values()).find(
      game => game.getState().gameStatus === 'waiting' || game.getState().gameStatus === 'playing'
    );

    return availableGame || this.createGame();
  }

  joinGame(playerId: string, playerName: string, gameId?: string): { game: MinesweeperGame; player: Player } {
    const game = this.getOrCreateGame(gameId);
    const player = game.addPlayer(playerId, playerName);
    this.playerToGame.set(playerId, game.id);
    return { game, player };
  }

  leaveGame(playerId: string): MinesweeperGame | undefined {
    const gameId = this.playerToGame.get(playerId);
    if (!gameId) return undefined;

    const game = this.games.get(gameId);
    if (game) {
      game.removePlayer(playerId);
      this.playerToGame.delete(playerId);

      if (game.getState().players.length === 0) {
        this.games.delete(gameId);
      }
    }
    return game;
  }

  getPlayerGame(playerId: string): MinesweeperGame | undefined {
    const gameId = this.playerToGame.get(playerId);
    return gameId ? this.games.get(gameId) : undefined;
  }

  private generateGameId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
