import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MoodEntry from './pages/MoodEntry';
import Analytics from './pages/Analytics';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import { MoodProvider } from './context/MoodContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MoodProvider>
          <Router>
            <ProtectedRoute>
              <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/mood-entry" element={<MoodEntry />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          </Router>
        </MoodProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;