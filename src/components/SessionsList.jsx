import { useState } from 'react';
import { formatDuration } from '../utils/firestoreService';
import SessionCard from './SessionCard';
import './SessionsList.css';

function SessionsList({ sessions = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const calculateTotalDuration = () => {
    return sessions.reduce((sum, session) => sum + session.duration, 0);
  };

  const totalPages = Math.ceil(sessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSessions = sessions.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
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
          {/* Total Duration for Today - DISPLAYED AT TOP */}
          <div className="sessions-total">
            <span>Total Duration Today:</span>
            <span className="total-value">
              {formatDuration(calculateTotalDuration())}
            </span>
          </div>

          {paginatedSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
            />
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="pagination-btn"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SessionsList;
