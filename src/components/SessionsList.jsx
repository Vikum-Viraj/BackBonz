import { formatTime, formatDuration } from '../utils/firestoreService';
import './SessionsList.css';

function SessionsList({ sessions = [] }) {
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
            <div key={session.id} className="session-item">
              <div className="session-time-range">
                <span className="session-time">
                  {formatTime(session.startTime)} - {formatTime(session.endTime)}
                </span>
              </div>
              <div className="session-duration">
                {formatDuration(session.duration)}
              </div>
            </div>
          ))}

          {/* Total Duration for Today */}
          {sessions.length > 0 && (
            <div className="sessions-total">
              <span>Total Duration:</span>
              <span className="total-value">
                {formatDuration(sessions.reduce((sum, s) => sum + s.duration, 0))}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SessionsList;
