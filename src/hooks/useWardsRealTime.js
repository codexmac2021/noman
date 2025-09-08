import { useState, useEffect } from 'react';
import { useSharePoint } from './useSharePoint';

export const useWardsRealTime = () => {
  const [wards, setWards] = useState([]);
  const { getListItems, loading, error } = useSharePoint();

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const wardsData = await getListItems('wards');
        
        // Fetch room counts for each ward
        const wardsWithCounts = await Promise.all(
          wardsData.map(async (ward) => {
            const rooms = await getListItems('rooms', `WardId eq ${ward.Id}`);
            
            const statusCounts = {
              available: 0,
              occupied: 0,
              'for cleaning': 0
            };
            
            rooms.forEach(room => {
              const status = room.Status?.toLowerCase() || 'available';
              if (statusCounts.hasOwnProperty(status)) {
                statusCounts[status]++;
              }
            });
            
            return {
              id: ward.Id,
              name: ward.Title,
              icon: ward.Icon,
              roomCounts: statusCounts,
              totalRooms: rooms.length
            };
          })
        );
        
        setWards(wardsWithCounts);
      } catch (err) {
        console.error('Error fetching wards:', err);
      }
    };

    fetchWards();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchWards, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { wards, loading, error };
};