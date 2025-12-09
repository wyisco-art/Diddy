# Multiplayer Minesweeper

A real-time multiplayer minesweeper game built with React, TypeScript, Node.js, and Socket.io.

## Features

- **Real-time multiplayer**: Play with multiple players on the same board
- **Live updates**: See other players' moves instantly
- **Player scoring**: Track who reveals the most cells
- **Color-coded players**: Each player has a unique color, and revealed cells show borders in the player's color
- **Multiple difficulty levels**: Easy, Medium, Hard, or create custom games
- **Room system**: Multiple games can run simultaneously
- **Responsive UI**: Modern, clean interface with smooth animations

## Game Rules

- Multiple players play on the same minesweeper board
- Left-click to reveal a cell
- Right-click to flag a cell as a mine
- Players earn points for each cell they reveal
- The game ends when someone hits a mine (loss) or all safe cells are revealed (win)
- The player with the most revealed cells wins!

## Tech Stack

### Frontend
- React 18
- TypeScript
- Socket.io Client
- Vite

### Backend
- Node.js
- Express
- Socket.io
- TypeScript

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Diddy
```

2. Install dependencies for both client and server:
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

## Running the Game

### Development Mode

Run both client and server concurrently:
```bash
npm run dev
```

Or run them separately:

Terminal 1 (Server):
```bash
npm run dev:server
```

Terminal 2 (Client):
```bash
npm run dev:client
```

The game will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Production Build

Build both client and server:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## How to Play

1. Open http://localhost:3000 in your browser
2. Enter your name and click "Join Game"
3. You'll be placed in an available game room or a new one will be created
4. Choose a difficulty level or create a custom game:
   - **Easy**: 9x9 grid, 10 mines
   - **Medium**: 16x16 grid, 40 mines
   - **Hard**: 30x16 grid, 99 mines
   - **Custom**: Choose your own dimensions and mine count
5. Left-click cells to reveal them
6. Right-click cells to flag them as mines
7. Compete with other players to reveal the most cells!

## Multiplayer Features

- **Automatic matchmaking**: Players joining without a game ID are automatically matched to available games
- **Real-time updates**: See other players' moves as they happen
- **Player leaderboard**: Track scores in real-time
- **Color-coded reveals**: Each revealed cell shows a colored border indicating which player revealed it
- **Multiple concurrent games**: The server supports multiple game rooms running simultaneously

## Project Structure

```
Diddy/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Board.tsx
│   │   │   ├── PlayerList.tsx
│   │   │   └── GameControls.tsx
│   │   ├── App.tsx
│   │   ├── socket.ts      # Socket.io client
│   │   └── types.ts       # TypeScript types
│   ├── package.json
│   └── vite.config.ts
├── server/                # Node.js backend
│   ├── src/
│   │   ├── game.ts        # Minesweeper game logic
│   │   ├── gameManager.ts # Game room management
│   │   ├── index.ts       # Express + Socket.io server
│   │   └── types.ts       # TypeScript types
│   ├── package.json
│   └── tsconfig.json
└── package.json           # Root package.json
```

## API / Socket Events

### Client → Server
- `join-game`: Join a game room
- `reveal-cell`: Reveal a cell at (row, col)
- `flag-cell`: Flag/unflag a cell at (row, col)
- `new-game`: Create a new game with custom settings

### Server → Client
- `game-state`: Full game state update
- `player-joined`: New player joined the game
- `player-left`: Player left the game
- `game-over`: Game ended (won/lost)
- `error`: Error message

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
