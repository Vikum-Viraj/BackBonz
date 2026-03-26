import { useState, useEffect } from 'react';
import { useWearTimer } from '../hooks/useWearTimer';
import { saveSession, getTodaySessions, formatDuration, formatTime } from '../utils/firestoreService';
import SessionsList from './SessionsList';
import { toast } from 'react-toastify';
import './WearTimer.css';

function WearTimer({ user }) {
  const timer = useWearTimer();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load today's sessions on component mount
  useEffect(() => {
    loadSessions();
  }, [user?.uid]);

  const loadSessions = async () => {
    if (user?.uid) {
      const todaySessions = await getTodaySessions(user.uid);
      setSessions(todaySessions);
    }
  };

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
    setLoading(true);
    try {
      const sessionData = timer.stop();

      if (sessionData && user?.uid) {
        // Calculate actual start and end times based on elapsed seconds
        const endTime = new Date();
        const startTime = new Date(endTime.getTime() - sessionData.duration * 1000);

        const result = await saveSession(
          user.uid,
          startTime,
          endTime,
          sessionData.duration
        );

        if (result.success) {
          toast.success(`Session saved! ${formatDuration(sessionData.duration)}`);
          // Reload sessions
          await loadSessions();
        } else {
          toast.error('Failed to save session');
        }
      }
    } catch (error) {
      console.error('Error stopping timer:', error);
      toast.error('Error saving session');
    } finally {
      setLoading(false);
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
      <SessionsList sessions={sessions} />
    </div>
  );
}

export default WearTimer;
