// WardCard.jsx

// import {
//   Ambulance,
//   Stethoscope,
//   Scissors,
//   Clock,
//   FileText,
//   Building
// } from "lucide-react";

// Icon mapping (could also be in a separate file)

// const wardIcons = {
//   'er rooms pediatrics': <Ambulance className="w-8 h-8 text-blue-500" />,
//   'med 5': <Stethoscope className="w-8 h-8 text-green-500" />,
//   'psrg': <Scissors className="w-8 h-8 text-red-500" />,
//   'srg 1': <Scissors className="w-8 h-8 text-red-500" />,
//   'er t3': <Ambulance className="w-8 h-8 text-blue-500" />,
//   'srg 2': <Scissors className="w-8 h-8 text-red-500" />,
//   'med 2': <Stethoscope className="w-8 h-8 text-green-500" />,
//   'med 4': <Stethoscope className="w-8 h-8 text-green-500" />,
//   'test manual': <FileText className="w-8 h-8 text-gray-500" />,
//   'er rooms ped': <Ambulance className="w-8 h-8 text-blue-500" />,
//   'ssu': <Clock className="w-8 h-8 text-yellow-500" />,
//   'med 1 a': <Stethoscope className="w-8 h-8 text-green-500" />,
//   'med 3': <Stethoscope className="w-8 h-8 text-green-500" />,
//   'default': <Building className="w-8 h-8 text-gray-500" />
// };

// src/components/WardCard.jsx
import React from 'react';

const wardIcons = {
  'er rooms - pediatrics': '🚑👶', 
  'med 5': '🩺💊',
  'psrg': '✂️🔧',
  'srg 1': '✂️🩹',
  'er t3': '🚑⚡',
  'srg2': '✂️🔪',
  'med 2': '🩺💉',
  'med 4': '🩺💊',
  'test manual': '📄🧪',
  'er rooms - ped': '🚑👶', 
  'ssu': '⏳🛏️',
  'med 1 - a': '🩺📋',
  'med 3': '🩺💉',
  'default': '🏥✨'
};

const getWardIcon = (wardName) => {
  const lowerCaseName = wardName.toLowerCase();
  
  for (const [key, icon] of Object.entries(wardIcons)) {
    if (lowerCaseName.includes(key)) {
      return icon;
    }
  }
  
  return wardIcons.default;
};

const WardCard = ({ ward, onClick }) => {
  const { name, roomCounts, totalRooms } = ward;
  
  // Get the appropriate icon based on ward name
  const wardIcon = ward.icon || getWardIcon(name);
  
  
  // Calculate status counts
  const available = roomCounts.available || 0;
  const occupied = roomCounts.occupied || 0;
  const cleaning = roomCounts['for cleaning'] || 0;
  
  // Calculate percentage for progress bar
  const availablePercentage = totalRooms > 0 ? (available / totalRooms) * 100 : 0;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-100"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-4xl">{wardIcon}</div>
          <div className="text-sm text-gray-500 font-medium">
            {totalRooms} Rooms
          </div>
        </div>
        
        <h3 className="text-xl font-din font-bold text-dark-gray-70 mb-4">{name}</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-green-600 font-din font-light">Available</span>
            </div>
            <span className="font-semibold text-green-600">{available}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-red-600 font-din font-light">Occupied</span>
            </div>
            <span className="font-semibold text-red-600">{occupied}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-yellow-600 font-din font-light"> For Cleaning</span>
            </div>
            <span className="font-semibold text-yellow-600">{cleaning}</span>
          </div>
        </div>
        
        <div className="mt-4 bg-gray-100 rounded-lg h-2">
          <div 
            className="bg-green-500 h-2 rounded-lg transition-all duration-300" 
            style={{ width: `${availablePercentage}%` }}
          ></div>
        </div>
        
        {/* Real-time indicator */}
        <div className="mt-3 flex items-center justify-end">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
            <span className="text-xs font-din font-light ">Live updates</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardCard;