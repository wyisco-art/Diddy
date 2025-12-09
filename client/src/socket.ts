import { io, Socket } from 'socket.io-client';
import { GameState, Player } from './types';

interface ServerEvents {
  'game-state': (state: GameState) => void;
  'player-joined': (player: Player) => void;
  'player-left': (playerId: string) => void;
  'game-over': (data: { status: 'won' | 'lost'; winner?: Player }) => void;
  error: (message: string) => void;
}

interface ClientEvents {
  'join-game': (data: { playerName: string; gameId?: string }) => void;
  'reveal-cell': (data: { row: number; col: number }) => void;
  'flag-cell': (data: { row: number; col: number }) => void;
  'new-game': (data: { width: number; height: number; mineCount: number }) => void;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const socket: Socket<ServerEvents, ClientEvents> = io(BACKEND_URL, {
  autoConnect: false,
});

export default socket;
