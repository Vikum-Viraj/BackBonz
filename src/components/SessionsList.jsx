import { formatDuration } from '../utils/firestoreService';
import SessionCard from './SessionCard';
import './SessionsList.css';

function SessionsList({ sessions = [], onDeleteSession }) {
  const calculateTotalDuration = () => {
    return sessions.reduce((sum, session) => sum + session.duration, 0);
  };

  return (
    <div className="sessions-container">
      <div className="sessions-header">
        <h3>Today's Sessions</h3>
        <span className="session-count">{sessions.length}</span>
      </div>

      {sessions.length === 0 ? (
        <div className="sessions-empty">
          <p>No sessions completed today yet. Start your first session!</p>
        </div>
      ) : (
        <div className="sessions-list">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onDelete={onDeleteSession}
            />
          ))}

          {/* Total Duration for Today */}
          <div className="sessions-total">
            <span>Total Duration Today:</span>
            <span className="total-value">
              {formatDuration(calculateTotalDuration())}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionsList;
