import { Cell, Player } from '../types';
import './Board.css';

interface BoardProps {
  board: Cell[][];
  players: Player[];
  onCellClick: (row: number, col: number, isRightClick: boolean) => void;
  gameStatus: string;
}

function Board({ board, players, onCellClick, gameStatus }: BoardProps) {
  const getPlayerColor = (playerId?: string) => {
    if (!playerId) return 'transparent';
    const player = players.find(p => p.id === playerId);
    return player?.color || 'transparent';
  };

  const getCellContent = (cell: Cell) => {
    if (cell.isFlagged) {
      return '🚩';
    }
    if (!cell.isRevealed) {
      return '';
    }
    if (cell.isMine) {
      return '💣';
    }
    if (cell.neighborMines === 0) {
      return '';
    }
    return cell.neighborMines.toString();
  };

  const getCellClass = (cell: Cell) => {
    const classes = ['cell'];
    if (cell.isRevealed) {
      classes.push('revealed');
      if (cell.isMine) {
        classes.push('mine');
      } else if (cell.neighborMines > 0) {
        classes.push(`number-${cell.neighborMines}`);
      }
    } else {
      classes.push('hidden');
    }
    if (cell.isFlagged) {
      classes.push('flagged');
    }
    return classes.join(' ');
  };

  const handleCellClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    onCellClick(row, col, false);
  };

  const handleContextMenu = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    onCellClick(row, col, true);
  };

  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell) => (
            <div
              key={`${cell.row}-${cell.col}`}
              className={getCellClass(cell)}
              onClick={(e) => handleCellClick(e, cell.row, cell.col)}
              onContextMenu={(e) => handleContextMenu(e, cell.row, cell.col)}
              style={{
                borderColor: cell.isRevealed && cell.revealedBy
                  ? getPlayerColor(cell.revealedBy)
                  : undefined,
                borderWidth: cell.isRevealed && cell.revealedBy ? '2px' : undefined,
              }}
            >
              {getCellContent(cell)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
