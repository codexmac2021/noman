import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useWardsRealTime } from '../hooks/useWardsRealTime'; 
import WardCard from '../components/WardCard';
import LoadingSpinner from '../components/LoadingSpinner';

const WardsPage = () => {
  const navigate = useNavigate();
  const { wards, loading, error } = useWardsRealTime();

  if (loading) return <LoadingSpinner message="Loading hospital wards..." />;
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-din font-normal text-gray-700 mb-2">Connection Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const handleWardClick = (ward) => {
    navigate(`/ward/${ward.id}`, { state: { wardName: ward.name } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-indigo-100  overflow-hidden ">
      <main className="fixed top-[150px]  sm:top-[185px] left-0  right-0 border-2 border-yellow-100 flex-grow overflow-y-auto py-4 w-full mx-auto px-4 sm:px-8 lg:px-8 sm:py-8 scrollbar-custom "
      style={{ bottom: '20px'}}>

        <div className="mb-8 ">
          <h2 className="text-2xl font-din font-normal text-dark-gray-70 mb-2">Hospital Wards</h2>
          <p className=" font-din font-light text-dark-gray-70">Select a ward to view and manage room statuses</p>
        </div>

        {wards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-din font-normal text-gray-700">No wards found. Please check your SharePoint configuration.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wards.map((ward) => (
              <WardCard
                key={ward.id}
                ward={ward}
                onClick={() => handleWardClick(ward)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default WardsPage;