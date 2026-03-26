import { useState, useCallback } from 'react';
import { getTodaySessions, saveSession } from '../utils/firestoreService';
import { toast } from 'react-toastify';

export const useSessionManager = (user) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load today's sessions
  const loadSessions = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      const todaySessions = await getTodaySessions(user.uid);
      setSessions(todaySessions);
      return todaySessions;
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast.error('Failed to load sessions');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  // Save a new session
  const handleSaveSession = useCallback(
    async (startTime, endTime, duration) => {
      if (!user?.uid) {
        toast.error('User not authenticated');
        return false;
      }

      try {
        setLoading(true);
        const result = await saveSession(user.uid, startTime, endTime, duration);

        if (result.success) {
          toast.success(`Session saved!`);
          // Reload sessions after saving
          await loadSessions();
          return true;
        } else {
          toast.error('Failed to save session');
          return false;
        }
      } catch (error) {
        console.error('Error saving session:', error);
        toast.error('Error saving session');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user?.uid, loadSessions]
  );

  // Delete a session (placeholder for future implementation)
  const handleDeleteSession = useCallback(
    async (sessionId) => {
      try {
        setLoading(true);
        // TODO: Implement delete session function in firestoreService
        console.log('Deleting session:', sessionId);
        await loadSessions();
      } catch (error) {
        console.error('Error deleting session:', error);
        toast.error('Failed to delete session');
      } finally {
        setLoading(false);
      }
    },
    [loadSessions]
  );

  return {
    sessions,
    loading,
    loadSessions,
    handleSaveSession,
    handleDeleteSession,
  };
};
