import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, TrendingUp, Calendar, Smile } from 'lucide-react';
import { useMood, MOOD_LEVELS } from '../context/MoodContext';
import { format } from 'date-fns';

const Dashboard = () => {
  const { getWeeklyMoodData, getMoodStats, getRecentEntries } = useMood();
  
  const weeklyData = getWeeklyMoodData();
  const stats = getMoodStats();
  const recentEntries = getRecentEntries(3);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          How are you feeling today? Track your mood and discover patterns in your emotional well-being.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/mood-entry" className="card hover:shadow-lg transition-shadow duration-200 group">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <PlusCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Add Mood</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Log today's mood</p>
            </div>
          </div>
        </Link>

        <Link to="/analytics" className="card hover:shadow-lg transition-shadow duration-200 group">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <TrendingUp className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Analytics</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">View insights</p>
            </div>
          </div>
        </Link>

        <Link to="/calendar" className="card hover:shadow-lg transition-shadow duration-200 group">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Calendar className="w-6 h-6 text-accent-600 dark:text-accent-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Calendar</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monthly view</p>
            </div>
          </div>
        </Link>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <Smile className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {stats ? `${stats.totalEntries} Entries` : 'No Entries'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total logged</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Overview */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">This Week</h2>
          <div className="grid grid-cols-7 gap-2">
            {weeklyData.map((day) => (
              <div key={day.date} className="text-center">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {day.day}
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg mx-auto ${
                  day.hasEntry 
                    ? `bg-${MOOD_LEVELS[day.mood]?.color} text-white` 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                }`}>
                  {day.hasEntry ? MOOD_LEVELS[day.mood]?.emoji : '?'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Entries */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Entries</h2>
            <Link to="/analytics" className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
              View all
            </Link>
          </div>
          
          {recentEntries.length > 0 ? (
            <div className="space-y-4">
              {recentEntries.map((entry) => (
                <div key={entry.id} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-2xl">
                    {MOOD_LEVELS[entry.mood]?.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {MOOD_LEVELS[entry.mood]?.label}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(entry.timestamp), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    {entry.note && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">
                        {entry.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Smile className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">No mood entries yet</p>
              <Link to="/mood-entry" className="btn-primary">
                Add Your First Mood
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {stats.averageMood}
            </div>
            <p className="text-gray-600 dark:text-gray-400">Average Mood</p>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl mb-2">
              {MOOD_LEVELS[stats.mostCommonMood]?.emoji}
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {MOOD_LEVELS[stats.mostCommonMood]?.label}
            </p>
            <p className="text-gray-600 dark:text-gray-400">Most Common</p>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-secondary-600 dark:text-secondary-400 mb-2">
              {stats.totalEntries}
            </div>
            <p className="text-gray-600 dark:text-gray-400">Total Entries</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;