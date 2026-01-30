import React, { useState } from 'react';
import { 
  Moon, 
  Sun, 
  Download, 
  Trash2, 
  Shield, 
  Bell,
  User,
  Database,
  Palette
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useMood } from '../context/MoodContext';

const Settings = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { moodEntries } = useMood();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const exportData = () => {
    const dataStr = JSON.stringify(moodEntries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mood-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    localStorage.removeItem('moodEntries');
    window.location.reload();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your MoodTracker experience and manage your data.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Appearance
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Theme</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose between light and dark mode
                </p>
              </div>
              <button
                onClick={toggleDarkMode}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-4 h-4" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-900/20 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Data & Privacy
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Export Data</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Download all your mood data as a JSON file
                </p>
              </div>
              <button
                onClick={exportData}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-red-600 dark:text-red-400">
                    Delete All Data
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Permanently remove all mood entries. This cannot be undone.
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete All</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Information */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent-600 dark:text-accent-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Privacy & Security
            </h2>
          </div>

          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>All your data is stored locally in your browser. Nothing is sent to external servers.</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Your mood entries and personal notes remain completely private.</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>You can export your data at any time and delete it permanently if needed.</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>No tracking, analytics, or third-party services are used.</p>
            </div>
          </div>
        </div>

        {/* App Information */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              About MoodTracker
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Version</span>
                <p className="font-medium text-gray-900 dark:text-white">1.0.0</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Total Entries</span>
                <p className="font-medium text-gray-900 dark:text-white">{moodEntries.length}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                MoodTracker is a mental health and wellness application designed to help you 
                understand your emotional patterns and improve your well-being through mindful tracking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Delete All Data?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This will permanently delete all your mood entries, notes, and settings. 
              This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={clearAllData}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Delete All Data
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;