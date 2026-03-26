import { formatTime, formatDuration } from '../utils/firestoreService';
import './SessionCard.css';

function SessionCard({ session }) {
  const { startTime, endTime, duration } = session;

  return (
    <div className="session-card">
      <div className="session-info">
        <span className="session-detail">
          <span className="label">Start:</span> {formatTime(startTime)}
        </span>
        <span className="separator">→</span>
        <span className="session-detail">
          <span className="label">End:</span> {formatTime(endTime)}
        </span>
        <span className="session-detail">
          <span className="label">Duration:</span> {formatDuration(duration)}
        </span>
      </div>
    </div>
  );
}

export default SessionCard;
