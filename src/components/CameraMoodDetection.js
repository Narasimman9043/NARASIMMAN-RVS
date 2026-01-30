import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, CameraOff, RotateCcw, CheckCircle, Smile, Frown, Meh } from 'lucide-react';

const CameraMoodDetection = ({ onMoodDetected, selectedMood, onMoodSelect }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraOn(true);
        setError(null);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setDetectedMood(null);
    setConfidence(0);
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Simulate mood detection based on user interaction
  const simulateMoodDetection = useCallback(() => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      // Simple random mood detection for demo
      // In a real app, this would use actual face detection
      const moods = [1, 2, 3, 4, 5];
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      const randomConfidence = Math.random() * 0.3 + 0.7;
      
      setDetectedMood(randomMood);
      setConfidence(randomConfidence);
      setIsAnalyzing(false);
      
      if (onMoodDetected) {
        onMoodDetected(randomMood);
      }
    }, 2000);
  }, [onMoodDetected]);

  const acceptDetectedMood = useCallback(() => {
    if (detectedMood && onMoodSelect) {
      onMoodSelect(detectedMood);
    }
  }, [detectedMood, onMoodSelect]);

  const getMoodLabel = (moodLevel) => {
    const moodLabels = {
      1: { label: 'Very Sad', emoji: '😢', color: 'red', icon: Frown },
      2: { label: 'Sad', emoji: '😔', color: 'orange', icon: Frown },
      3: { label: 'Neutral', emoji: '😐', color: 'yellow', icon: Meh },
      4: { label: 'Happy', emoji: '😊', color: 'green', icon: Smile },
      5: { label: 'Very Happy', emoji: '😄', color: 'blue', icon: Smile }
    };
    return moodLabels[moodLevel] || moodLabels[3];
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Camera Mood Detection
        </h2>
        <div className="flex space-x-2">
          {!isCameraOn ? (
            <button
              onClick={startCamera}
              className="btn-primary flex items-center space-x-2 text-sm"
            >
              <Camera className="w-4 h-4" />
              <span>Start Camera</span>
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="btn-secondary flex items-center space-x-2 text-sm"
            >
              <CameraOff className="w-4 h-4" />
              <span>Stop Camera</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="mb-4 p-4 bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg">
        <p className="text-blue-700 dark:text-blue-400 text-sm">
          <strong>Demo Mode:</strong> This is a simplified version. Click "Detect Mood" to simulate facial expression analysis. 
          For full AI-powered mood detection, additional ML libraries would be integrated.
        </p>
      </div>

      {isCameraOn && (
        <div className="space-y-4">
          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 object-cover"
            />
            <canvas
              ref={canvasRef}
              className="hidden"
              width="640"
              height="480"
            />
            
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-sm">Analyzing facial expression...</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={simulateMoodDetection}
              disabled={isAnalyzing}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAnalyzing ? 'Analyzing...' : 'Detect Mood'}</span>
            </button>
          </div>

          {detectedMood && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{getMoodLabel(detectedMood).emoji}</span>
                  <div>
                    <p className="font-semibold text-green-800 dark:text-green-200">
                      Detected: {getMoodLabel(detectedMood).label}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Confidence: {Math.round(confidence * 100)}%
                    </p>
                  </div>
                </div>
                <button
                  onClick={acceptDetectedMood}
                  className="btn-primary flex items-center space-x-2 text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Use This Mood</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!isCameraOn && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Click "Start Camera" to begin mood detection</p>
          <p className="text-sm mt-2">
            We'll analyze your facial expression to suggest a mood level
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          How it works:
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Start your camera and position your face in the frame</li>
          <li>• Click "Detect Mood" to analyze your facial expression</li>
          <li>• The system will suggest a mood based on your expression</li>
          <li>• Accept the suggestion or manually select your mood below</li>
        </ul>
      </div>
    </div>
  );
};

export default CameraMoodDetection;