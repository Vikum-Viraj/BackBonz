import { useState, useEffect, useRef } from 'react';

export const useWearTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [displayTime, setDisplayTime] = useState('00:00:00');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Store timestamps for accurate elapsed time calculation
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);
  const pausedAtRef = useRef(null);
  const intervalRef = useRef(null);

  // Start the timer
  const start = () => {
    if (!isRunning) {
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      pausedAtRef.current = null;
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  // Pause the timer
  const pause = () => {
    if (isRunning && !isPaused) {
      pausedAtRef.current = Date.now();
      setIsPaused(true);
    }
  };

  // Resume the timer
  const resume = () => {
    if (isRunning && isPaused) {
      const pausedDuration = Date.now() - pausedAtRef.current;
      startTimeRef.current += pausedDuration;
      pausedAtRef.current = null;
      setIsPaused(false);
    }
  };

  // Stop the timer and return final data
  const stop = () => {
    if (isRunning) {
      setIsRunning(false);
      setIsPaused(false);

      const finalElapsed = elapsedSeconds;

      // Reset for next session
      setElapsedSeconds(0);
      setDisplayTime('00:00:00');
      startTimeRef.current = null;
      pausedTimeRef.current = 0;
      pausedAtRef.current = null;

      return {
        startTime: new Date(startTimeRef.current),
        endTime: new Date(),
        duration: finalElapsed,
      };
    }
    return null;
  };

  // Update display every 100ms for smooth updates
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (isRunning && !isPaused && startTimeRef.current !== null) {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current) / 1000);
        setElapsedSeconds(elapsed);
        pausedTimeRef.current = elapsed * 1000;

        // Calculate HH:MM:SS
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;

        setDisplayTime(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      }
    }, 100);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused]);

  return {
    displayTime,
    elapsedSeconds,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    stop,
  };
};
