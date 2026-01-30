import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks } from 'date-fns';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDocs 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const MoodContext = createContext();

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};

export const MOOD_LEVELS = {
  5: { label: 'Excellent', emoji: '😄', color: 'mood-excellent' },
  4: { label: 'Good', emoji: '😊', color: 'mood-good' },
  3: { label: 'Okay', emoji: '😐', color: 'mood-okay' },
  2: { label: 'Bad', emoji: '😔', color: 'mood-bad' },
  1: { label: 'Terrible', emoji: '😢', color: 'mood-terrible' }
};

export const MOOD_TAGS = [
  'Work', 'Sleep', 'Exercise', 'Food', 'Social', 'Weather', 
  'Health', 'Stress', 'Family', 'Hobbies', 'Travel', 'Money'
];

export const MoodProvider = ({ children }) => {
  const { user } = useAuth();
  const [moodEntries, setMoodEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Listen to mood entries changes in Firestore
  useEffect(() => {
    if (!user) {
      setMoodEntries([]);
      return;
    }

    setIsLoading(true);
    const moodEntriesRef = collection(db, 'moodEntries');
    const q = query(
      moodEntriesRef,
      where('userId', '==', user.id),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMoodEntries(entries);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching mood entries:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addMoodEntry = async (entry) => {
    if (!user) return;
    
    try {
      const newEntry = {
        userId: user.id,
        date: format(new Date(), 'yyyy-MM-dd'),
        timestamp: new Date().toISOString(),
        ...entry
      };

      await addDoc(collection(db, 'moodEntries'), newEntry);
    } catch (error) {
      console.error('Error adding mood entry:', error);
      throw error;
    }
  };

  const updateMoodEntry = async (id, updates) => {
    if (!user) return;

    try {
      const entryRef = doc(db, 'moodEntries', id);
      await updateDoc(entryRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating mood entry:', error);
      throw error;
    }
  };

  const deleteMoodEntry = async (id) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'moodEntries', id));
    } catch (error) {
      console.error('Error deleting mood entry:', error);
      throw error;
    }
  };

  const getMoodByDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return moodEntries.find(entry => entry.date === dateStr);
  };

  const getWeeklyMoodData = () => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    return weekDays.map(day => {
      const mood = getMoodByDate(day);
      return {
        date: format(day, 'yyyy-MM-dd'),
        day: format(day, 'EEE'),
        mood: mood?.mood || null,
        hasEntry: !!mood
      };
    });
  };

  const getMoodStats = () => {
    const totalEntries = moodEntries.length;
    if (totalEntries === 0) return null;

    const moodCounts = moodEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    const averageMood = moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / totalEntries;
    
    const mostCommonMood = Object.entries(moodCounts)
      .reduce((a, b) => moodCounts[a[0]] > moodCounts[b[0]] ? a : b)[0];

    return {
      totalEntries,
      averageMood: Math.round(averageMood * 10) / 10,
      mostCommonMood: parseInt(mostCommonMood),
      moodCounts
    };
  };

  const getRecentEntries = (limit = 5) => {
    return moodEntries.slice(0, limit);
  };

  return (
    <MoodContext.Provider value={{
      moodEntries,
      isLoading,
      addMoodEntry,
      updateMoodEntry,
      deleteMoodEntry,
      getMoodByDate,
      getWeeklyMoodData,
      getMoodStats,
      getRecentEntries
    }}>
      {children}
    </MoodContext.Provider>
  );
};