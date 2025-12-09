import { Player } from '../types';
import './PlayerList.css';

interface PlayerListProps {
  players: Player[];
  myId: string;
}

function PlayerList({ players, myId }: PlayerListProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="player-list">
      <h3>Players</h3>
      <div className="players">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`player ${player.id === myId ? 'me' : ''}`}
          >
            <div className="player-rank">{index + 1}</div>
            <div
              className="player-color"
              style={{ backgroundColor: player.color }}
            />
            <div className="player-info">
              <div className="player-name">
                {player.name}
                {player.id === myId && ' (You)'}
              </div>
              <div className="player-score">{player.score} cells</div>
            </div>
          </div>
        ))}
        {players.length === 0 && (
          <div className="no-players">Waiting for players...</div>
        )}
      </div>
    </div>
  );
}

export default PlayerList;
