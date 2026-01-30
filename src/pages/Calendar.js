import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useMood, MOOD_LEVELS } from '../context/MoodContext';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { Link } from 'react-router-dom';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { getMoodByDate } = useMood();

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const navigateMonth = (direction) => {
    setCurrentDate(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  const getMoodColor = (mood) => {
    if (!mood) return 'bg-gray-100 dark:bg-gray-700';
    
    const colors = {
      5: 'bg-green-500',
      4: 'bg-green-400', 
      3: 'bg-yellow-400',
      2: 'bg-red-400',
      1: 'bg-red-500'
    };
    
    return colors[mood] || 'bg-gray-100 dark:bg-gray-700';
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Mood Calendar
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View your mood patterns across the month. Each day shows your recorded mood.
        </p>
      </div>

      {/* Calendar Header */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(day => {
            const mood = getMoodByDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);
            
            return (
              <div
                key={day.toISOString()}
                className={`
                  relative p-3 min-h-[80px] border border-gray-200 dark:border-gray-600 rounded-lg
                  ${isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'}
                  ${isCurrentDay ? 'ring-2 ring-primary-500' : ''}
                  transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`
                    text-sm font-medium
                    ${isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}
                    ${isCurrentDay ? 'text-primary-600 dark:text-primary-400 font-bold' : ''}
                  `}>
                    {format(day, 'd')}
                  </span>
                  
                  {isCurrentMonth && !mood && (
                    <Link
                      to="/mood-entry"
                      className="opacity-0 hover:opacity-100 transition-opacity duration-200"
                    >
                      <Plus className="w-4 h-4 text-gray-400 hover:text-primary-600" />
                    </Link>
                  )}
                </div>

                {mood && (
                  <div className="flex flex-col items-center space-y-1">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium
                      ${getMoodColor(mood.mood)}
                    `}>
                      {MOOD_LEVELS[mood.mood]?.emoji}
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {MOOD_LEVELS[mood.mood]?.label}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Mood Legend
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(MOOD_LEVELS).reverse().map(([level, mood]) => (
            <div key={level} className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full ${getMoodColor(parseInt(level))}`}>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {mood.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {mood.emoji}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats for Current Month */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {(() => {
          const monthStart = startOfMonth(currentDate);
          const monthEnd = endOfMonth(currentDate);
          const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
          const monthEntries = monthDays.map(day => getMoodByDate(day)).filter(Boolean);
          
          const avgMood = monthEntries.length > 0 
            ? monthEntries.reduce((sum, entry) => sum + entry.mood, 0) / monthEntries.length 
            : 0;
          
          const goodDays = monthEntries.filter(entry => entry.mood >= 4).length;
          
          return (
            <>
              <div className="card text-center">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {monthEntries.length}
                </div>
                <p className="text-gray-600 dark:text-gray-400">Days Tracked</p>
              </div>
              
              <div className="card text-center">
                <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-400 mb-2">
                  {avgMood > 0 ? avgMood.toFixed(1) : '—'}
                </div>
                <p className="text-gray-600 dark:text-gray-400">Average Mood</p>
              </div>
              
              <div className="card text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {goodDays}
                </div>
                <p className="text-gray-600 dark:text-gray-400">Good Days</p>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default Calendar;