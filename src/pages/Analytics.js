import React, { useMemo } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';
import { useMood, MOOD_LEVELS } from '../context/MoodContext';
import { format, subDays, eachDayOfInterval } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Analytics = () => {
  const { moodEntries, getMoodStats } = useMood();
  const stats = getMoodStats();

  // Prepare data for the last 30 days
  const last30DaysData = useMemo(() => {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 29);
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: today });
    
    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const entry = moodEntries.find(e => e.date === dateStr);
      return {
        date: dateStr,
        label: format(day, 'MMM d'),
        mood: entry?.mood || null
      };
    });
  }, [moodEntries]);

  // Chart configurations
  const lineChartData = {
    labels: last30DaysData.map(d => d.label),
    datasets: [
      {
        label: 'Daily Mood',
        data: last30DaysData.map(d => d.mood),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const mood = context.parsed.y;
            return mood ? `${MOOD_LEVELS[mood]?.label} (${mood}/5)` : 'No entry';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            return MOOD_LEVELS[value]?.emoji || '';
          }
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  const doughnutData = {
    labels: Object.values(MOOD_LEVELS).map(m => m.label),
    datasets: [
      {
        data: Object.keys(MOOD_LEVELS).map(level => stats?.moodCounts[level] || 0),
        backgroundColor: [
          '#EF4444', // Terrible
          '#F87171', // Bad  
          '#FBBF24', // Okay
          '#34D399', // Good
          '#10B981', // Excellent
        ],
        borderWidth: 0,
        hoverOffset: 4,
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      }
    }
  };

  // Tag analysis
  const tagAnalysis = useMemo(() => {
    const tagCounts = {};
    moodEntries.forEach(entry => {
      if (entry.tags) {
        entry.tags.forEach(tag => {
          if (!tagCounts[tag]) {
            tagCounts[tag] = { count: 0, totalMood: 0 };
          }
          tagCounts[tag].count++;
          tagCounts[tag].totalMood += entry.mood;
        });
      }
    });

    return Object.entries(tagCounts)
      .map(([tag, data]) => ({
        tag,
        count: data.count,
        averageMood: data.totalMood / data.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [moodEntries]);

  const tagChartData = {
    labels: tagAnalysis.map(t => t.tag),
    datasets: [
      {
        label: 'Average Mood',
        data: tagAnalysis.map(t => t.averageMood),
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
        borderColor: '#A855F7',
        borderWidth: 1,
      }
    ]
  };

  const tagChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
        }
      }
    }
  };

  if (!stats) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            No Data Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start tracking your moods to see analytics and insights.
          </p>
          <button className="btn-primary">Add Your First Mood</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics & Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover patterns in your mood and understand what influences your well-being.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.averageMood}
          </div>
          <p className="text-gray-600 dark:text-gray-400">Average Mood</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.totalEntries}
          </div>
          <p className="text-gray-600 dark:text-gray-400">Total Entries</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-accent-600 dark:text-accent-400" />
          </div>
          <div className="text-2xl mb-1">
            {MOOD_LEVELS[stats.mostCommonMood]?.emoji}
          </div>
          <p className="text-gray-600 dark:text-gray-400">Most Common</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {Math.round((moodEntries.filter(e => e.mood >= 4).length / stats.totalEntries) * 100)}%
          </div>
          <p className="text-gray-600 dark:text-gray-400">Good Days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Mood Trend */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            30-Day Mood Trend
          </h2>
          <div className="h-64">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Mood Distribution */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Mood Distribution
          </h2>
          <div className="h-64">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Tag Analysis */}
      {tagAnalysis.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Mood by Factors
          </h2>
          <div className="h-64 mb-6">
            <Bar data={tagChartData} options={tagChartOptions} />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tagAnalysis.map((item) => (
              <div key={item.tag} className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {item.tag}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {item.count} entries
                </div>
                <div className="text-sm font-medium text-accent-600 dark:text-accent-400">
                  Avg: {item.averageMood.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;