import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { useMood, MOOD_LEVELS, MOOD_TAGS } from '../context/MoodContext';
import CameraMoodDetection from '../components/CameraMoodDetection';

const MoodEntry = () => {
  const navigate = useNavigate();
  const { addMoodEntry } = useMood();
  
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMoodDetected = (detectedMood) => {
    // Optional: Auto-select the detected mood or just highlight it
    console.log('Mood detected:', detectedMood);
  };

  const handleMoodSelect = (moodLevel) => {
    setSelectedMood(moodLevel);
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) return;

    setIsSubmitting(true);
    
    try {
      addMoodEntry({
        mood: selectedMood,
        note: note.trim(),
        tags: selectedTags
      });
      
      // Success feedback
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (error) {
      console.error('Error saving mood entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          How are you feeling?
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Take a moment to reflect on your current mood and what might be influencing it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Camera Mood Detection */}
        <CameraMoodDetection 
          onMoodDetected={handleMoodDetected}
          selectedMood={selectedMood}
          onMoodSelect={handleMoodSelect}
        />

        {/* Mood Selection */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Select your mood
          </h2>
          
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(MOOD_LEVELS).reverse().map(([level, mood]) => (
              <button
                key={level}
                type="button"
                onClick={() => handleMoodSelect(parseInt(level))}
                className={`mood-button ${
                  selectedMood === parseInt(level)
                    ? `bg-${mood.color} text-white ring-2 ring-offset-2 ring-${mood.color} scale-110`
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className="text-2xl">{mood.emoji}</span>
              </button>
            ))}
          </div>
          
          {selectedMood && (
            <div className="mt-4 text-center animate-fade-in">
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {MOOD_LEVELS[selectedMood].label}
              </p>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            What's influencing your mood? (Optional)
          </h2>
          
          <div className="flex flex-wrap gap-2">
            {MOOD_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedTags.includes(tag)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Add a note (Optional)
          </h2>
          
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What happened today? How are you feeling? Any thoughts you'd like to remember..."
            rows={4}
            className="input-field resize-none"
          />
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {note.length}/500 characters
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={!selectedMood || isSubmitting}
            className="btn-primary flex items-center space-x-2 flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            <span>{isSubmitting ? 'Saving...' : 'Save Mood Entry'}</span>
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary flex items-center space-x-2 px-6"
          >
            <X className="w-5 h-5" />
            <span>Cancel</span>
          </button>
        </div>
      </form>

      {/* Mood Scale Reference */}
      <div className="mt-12 card bg-gray-50 dark:bg-gray-800/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Mood Scale Reference
        </h3>
        <div className="space-y-2">
          {Object.entries(MOOD_LEVELS).reverse().map(([level, mood]) => (
            <div key={level} className="flex items-center space-x-3">
              <span className="text-xl">{mood.emoji}</span>
              <span className="font-medium text-gray-900 dark:text-white">{mood.label}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {level === '5' && '- Feeling amazing, energetic, very positive'}
                {level === '4' && '- Good mood, content, optimistic'}
                {level === '3' && '- Neutral, balanced, neither good nor bad'}
                {level === '2' && '- Low mood, somewhat negative, tired'}
                {level === '1' && '- Very low, sad, overwhelmed, struggling'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodEntry;