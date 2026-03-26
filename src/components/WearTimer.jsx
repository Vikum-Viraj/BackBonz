import { useEffect } from 'react';
import { useWearTimer } from '../hooks/useWearTimer';
import { useSessionManager } from '../hooks/useSessionManager';
import { formatDuration } from '../utils/firestoreService';
import SessionsList from './SessionsList';
import { toast } from 'react-toastify';
import './WearTimer.css';

function WearTimer({ user }) {
  const timer = useWearTimer();
  const { sessions, loading, loadSessions, handleSaveSession, handleDeleteSession } = useSessionManager(user);

  // Load today's sessions on component mount
  useEffect(() => {
    loadSessions();
  }, [user?.uid, loadSessions]);

  const handleStart = () => {
    timer.start();
  };

  const handlePauseResume = () => {
    if (timer.isPaused) {
      timer.resume();
    } else {
      timer.pause();
    }
  };

  const handleStop = async () => {
    try {
      const sessionData = timer.stop();

      if (sessionData) {
        // Calculate actual start and end times based on elapsed seconds
        const endTime = new Date();
        const startTime = new Date(endTime.getTime() - sessionData.duration * 1000);

        const success = await handleSaveSession(startTime, endTime, sessionData.duration);

        if (success) {
          toast.success(`Session saved! ${formatDuration(sessionData.duration)}`);
        }
      }
    } catch (error) {
      console.error('Error stopping timer:', error);
      toast.error('Error saving session');
    }
  };

  return (
    <div className="wear-timer-container">
      <div className="timer-card">
        {/* Timer Display */}
        <div className="timer-display">
          <div className="timer-value">{timer.displayTime}</div>
          <p className="timer-label">Wear Duration</p>
        </div>

        {/* Control Buttons */}
        <div className="timer-controls">
          <button
            className="btn btn-primary"
            onClick={handleStart}
            disabled={timer.isRunning || loading}
            title="Start timer"
          >
            <span className="btn-icon">▶</span>
            <span>Start</span>
          </button>

          <button
            className="btn btn-secondary"
            onClick={handlePauseResume}
            disabled={!timer.isRunning || loading}
            title={timer.isPaused ? 'Resume timer' : 'Pause timer'}
          >
            <span className="btn-icon">{timer.isPaused ? '▶' : '⏸'}</span>
            <span>{timer.isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            className="btn btn-danger"
            onClick={handleStop}
            disabled={!timer.isRunning && timer.elapsedSeconds === 0 || loading}
            title="Stop and save session"
          >
            <span className="btn-icon">⏹</span>
            <span>{loading ? 'Saving...' : 'Stop'}</span>
          </button>
        </div>

        {/* Status Indicator */}
        <div className="timer-status">
          {timer.isRunning && !timer.isPaused && <span className="status-badge status-running">● Running</span>}
          {timer.isPaused && <span className="status-badge status-paused">⏸ Paused</span>}
          {!timer.isRunning && timer.elapsedSeconds === 0 && <span className="status-badge status-idle">○ Idle</span>}
        </div>
      </div>

      {/* Today's Sessions */}
      <SessionsList sessions={sessions} onDeleteSession={handleDeleteSession} />
    </div>
  );
}

export default WearTimer;
