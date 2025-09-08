import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WardsPage from './pages/WardsPage';
import RoomsPage from './pages/RoomsPage';
import HistoryPage from './pages/HistoryPage';
import Header from './components/Header';
import AddWardRoomPage from './pages/AddWardRoomPage';
import LoadingSpinner from './components/LoadingSpinner';

import { checkSharePointAuth } from './sharepoint/sharepointAuth';

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Check if we can authenticate with SharePoint
    const checkAuth = async () => {
      try {
        await checkSharePointAuth();
        setAuthChecked(true);
        setAuthError(null);
      } catch (error) {
        setAuthError(error.message);
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [retryCount]);

  const handleRetry = () => {
    setAuthChecked(false);
    setAuthError(null);
    setRetryCount(prev => prev + 1);
  };

  if (!authChecked) {
    return <LoadingSpinner message="Connecting to SharePoint..." />;
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <h2 className="text-xl font-din font-normal text-red-600 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{authError}</p>
          <p className="text-sm text-gray-500 mb-6">
            Please ensure:
            <br />1. You're connected to the hospital network
            <br />2. The proxy server is running on port 3001
            <br />3. Your SharePoint credentials are correct
          </p>
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-[130px] sm:min-h-[175px] bg-gradient-to-br from-yellow-50 to-indigo-100">
        <Header/>
      </div>
      
      <Routes>
        <Route path="/" element={<WardsPage />} />
        <Route path="/ward/:wardId" element={<RoomsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/add-ward-room" element={<AddWardRoomPage />} />
      </Routes>
    </Router>
  );
}

export default App;