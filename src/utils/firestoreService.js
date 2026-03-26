import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';

const SESSIONS_COLLECTION = 'sessions';

export const saveSession = async (userId, startTime, endTime, duration) => {
  try {
    console.log('📝 Saving session for userId:', userId);
    console.log('📝 Start time:', startTime);
    console.log('📝 End time:', endTime);
    console.log('📝 Duration:', duration);
    
    const sessionsRef = collection(db, SESSIONS_COLLECTION);
    const sessionData = {
      userId,
      startTime: Timestamp.fromDate(new Date(startTime)),
      endTime: Timestamp.fromDate(new Date(endTime)),
      duration, // in seconds
      createdAt: Timestamp.now(),
    };
    
    console.log('📝 Session data to save:', sessionData);
    
    const docRef = await addDoc(sessionsRef, sessionData);
    
    console.log('✅ Session saved! Document ID:', docRef.id);
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error('❌ Error saving session:', error);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error message:', error.message);
    console.error('❌ Full error:', error);
    return { success: false, error };
  }
};

export const getTodaySessions = async (userId) => {
  try {
    const sessionsRef = collection(db, SESSIONS_COLLECTION);
    const q = query(
      sessionsRef,
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const sessions = [];

    // Get today's date in local timezone (not UTC)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const startTime = data.startTime?.toDate();
      
      // Filter for today's sessions (client-side using local timezone)
      if (startTime && startTime >= today && startTime < tomorrow) {
        sessions.push({
          id: doc.id,
          ...data,
          startTime: startTime,
          endTime: data.endTime?.toDate(),
          createdAt: data.createdAt?.toDate(),
        });
      }
    });

    // Sort by startTime descending (client-side)
    sessions.sort((a, b) => b.startTime - a.startTime);

    return sessions;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
};

export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const formatTime = (date) => {
  if (!date) return '';
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};
