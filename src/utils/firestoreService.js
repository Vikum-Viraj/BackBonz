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
    const sessionsRef = collection(db, SESSIONS_COLLECTION);
    const docRef = await addDoc(sessionsRef, {
      userId,
      startTime: Timestamp.fromDate(new Date(startTime)),
      endTime: Timestamp.fromDate(new Date(endTime)),
      duration, // in seconds
      createdAt: Timestamp.now(),
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error('Error saving session:', error);
    return { success: false, error };
  }
};

export const getTodaySessions = async (userId) => {
  try {
    // Get start and end of today in UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    const sessionsRef = collection(db, SESSIONS_COLLECTION);
    const q = query(
      sessionsRef,
      where('userId', '==', userId),
      where('startTime', '>=', Timestamp.fromDate(today)),
      where('startTime', '<', Timestamp.fromDate(tomorrow)),
      orderBy('startTime', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const sessions = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      sessions.push({
        id: doc.id,
        ...data,
        startTime: data.startTime?.toDate(),
        endTime: data.endTime?.toDate(),
        createdAt: data.createdAt?.toDate(),
      });
    });

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
