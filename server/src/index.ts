import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GameManager } from './gameManager';
import { ClientEvents, ServerEvents } from './types';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server<ClientEvents, ServerEvents>(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const gameManager = new GameManager();

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on('join-game', ({ playerName, gameId }) => {
    try {
      const { game, player } = gameManager.joinGame(socket.id, playerName, gameId);

      socket.join(game.id);

      socket.emit('game-state', game.getPublicState());

      socket.to(game.id).emit('player-joined', player);

      console.log(`Player ${playerName} (${socket.id}) joined game ${game.id}`);
    } catch (error) {
      socket.emit('error', 'Failed to join game');
      console.error('Error joining game:', error);
    }
  });

  socket.on('reveal-cell', ({ row, col }) => {
    try {
      const game = gameManager.getPlayerGame(socket.id);
      if (!game) {
        socket.emit('error', 'Not in a game');
        return;
      }

      const result = game.revealCell(row, col, socket.id);

      io.to(game.id).emit('game-state', game.getPublicState());

      if (result.gameOver) {
        const state = game.getState();
        const winner = state.gameStatus === 'won'
          ? state.players.reduce((prev, current) =>
              (prev.score > current.score) ? prev : current
            )
          : undefined;

        io.to(game.id).emit('game-over', {
          status: state.gameStatus as 'won' | 'lost',
          winner
        });
      }
    } catch (error) {
      socket.emit('error', 'Failed to reveal cell');
      console.error('Error revealing cell:', error);
    }
  });

  socket.on('flag-cell', ({ row, col }) => {
    try {
      const game = gameManager.getPlayerGame(socket.id);
      if (!game) {
        socket.emit('error', 'Not in a game');
        return;
      }

      game.toggleFlag(row, col);
      io.to(game.id).emit('game-state', game.getPublicState());
    } catch (error) {
      socket.emit('error', 'Failed to flag cell');
      console.error('Error flagging cell:', error);
    }
  });

  socket.on('new-game', ({ width, height, mineCount }) => {
    try {
      const oldGame = gameManager.getPlayerGame(socket.id);
      if (oldGame) {
        socket.leave(oldGame.id);
        gameManager.leaveGame(socket.id);
      }

      const game = gameManager.createGame(undefined, width, height, mineCount);
      const playerName = `Player ${socket.id.substring(0, 4)}`;
      const player = game.addPlayer(socket.id, playerName);

      socket.join(game.id);
      socket.emit('game-state', game.getPublicState());

      console.log(`Player ${playerName} created new game ${game.id}`);
    } catch (error) {
      socket.emit('error', 'Failed to create new game');
      console.error('Error creating new game:', error);
    }
  });

  socket.on('disconnect', () => {
    try {
      const game = gameManager.leaveGame(socket.id);
      if (game) {
        socket.to(game.id).emit('player-left', socket.id);
        console.log(`Player ${socket.id} left game ${game.id}`);
      }
      console.log(`Player disconnected: ${socket.id}`);
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
