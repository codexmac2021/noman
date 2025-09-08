import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useRooms } from '../hooks/useRooms'; // Updated import
import RoomCard from '../components/RoomCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { HiArrowLeft, HiTrash } from 'react-icons/hi2';

const RoomsPage = () => {
  const { wardId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { rooms, loading, error, updateRoomStatus, clearAllRooms } = useRooms(wardId);

  // Get ward name from location state or fallback to formatting the ID
  const wardName = location.state?.wardName || formatWardIdToName(wardId);

  if (loading) return <LoadingSpinner message="Loading rooms..." />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-din font-normal text-red-600 mb-2">Connection Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to mark all rooms as Available? ')) {
      try {
        await clearAllRooms();
      } catch (err) {
        console.error('Error clearing all rooms:', err);
        alert('Failed to clear all rooms. Please try again.');
      }
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  // Helper function to format ward ID to name
  const formatWardIdToName = (id) => {
    return id
      .replace(/^ward-?/i, '')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-indigo-100 ">
      {/* Header */}
      <header className=" fixed top-[150px] sm:top-48 w-full z-19 bg-white shadow-sm border-b border-t border-r-2 border-l-2 border-yellow-50 border-t-gray-200   ">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
          <div className="flex items-center justify-between">

            {/* Title & Rooms */}
            <div className="flex items-center space-x-4">
              <h1 className="text-l sm:text-xl font-din font-bold text-dark-gray-70">{wardName} :</h1>
              <h1 className="text-s  sm:text-l sm:mt-1 font-din font-light text-dark-gray-70 ">{rooms.length} Rooms</h1>
            </div>
            {/* Clear All Button */}
            <button
              onClick={handleClearAll}
              className="flex items-center space-x-2 text-sm sm:text-[16px] px-3 py-2 bg-yellow-100 hover:bg-yellow-200 font-din font-regular text-dark-gray-70 rounded-lg transition-colors duration-200 font-medium"
            >
              <HiTrash className="w-5 h-5" />
              <span>Clear All</span>
            </button>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className=" fixed top-[225px] sm:top-[275px] [bottom:52px] sm:[bottom:60px] border-2 border-yellow-100 rounded-xl  left-0 right-0 w-full pt-3 sm:pt-6 flex-grow overflow-y-auto max-w-8xl  mx-auto px-4 sm:px-6 lg:px-8 py-8 scrollbar-custom">
        {rooms.length === 0 ? (
          <div className="text-left py-4">
            <p className="text-lg font-din font-normal text-dark-gray-70">No rooms found for this ward.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onStatusChange={updateRoomStatus}
              />
            ))}
          </div>
        )}
      </main>

      {/* Back Button - Fixed Bottom Left */}
      <div className=" fixed bottom-2 left-6 ">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2  text-sm sm:text-[16px] px-3 py-2 sm:px-4 sm:py-2  bg-yellow-100 hover:bg-yellow-200 font-din font-regular text-dark-gray-70 rounded-full shadow-lg transition-all duration-200 font-medium hover:shadow-xl"
        >
          <HiArrowLeft className="w-5 h-5" />
          <span>Back to Wards</span>
        </button>
      </div>
    </div>
  );
};

export default RoomsPage;