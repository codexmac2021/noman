import { useState } from 'react';
import { useSharePoint } from './useSharePoint';

export const useHistory = () => {
  const [history, setHistory] = useState([]);
  const { getListItems, loading, error } = useSharePoint();

  const fetchHistory = async (filters = {}) => {
    try {
      let filterQuery = '';
      
      if (filters.wardId) {
        filterQuery += `WardId eq ${filters.wardId}`;
      }
      
      if (filters.roomId) {
        if (filterQuery) filterQuery += ' and ';
        filterQuery += `RoomId eq '${filters.roomId}'`;
      }
      
      if (filters.startDate) {
        if (filterQuery) filterQuery += ' and ';
        filterQuery += `Timestamp ge '${filters.startDate}T00:00:00Z'`;
      }
      
      if (filters.endDate) {
        if (filterQuery) filterQuery += ' and ';
        filterQuery += `Timestamp le '${filters.endDate}T23:59:59Z'`;
      }
      
      const historyData = await getListItems('history', filterQuery);
      
      // Get ward names for each history entry
      const historyWithWardNames = await Promise.all(
        historyData.map(async (item) => {
          let wardName = 'Unknown Ward';
          try {
            const ward = await getListItems('wards', `Id eq ${item.WardId}`);
            if (ward.length > 0) {
              wardName = ward[0].Title;
            }
          } catch (err) {
            console.warn('Could not fetch ward name:', err);
          }
          
          return {
            id: item.Id,
            roomId: item.RoomId,
            wardId: item.WardId,
            wardName: wardName,
            previousStatus: item.PreviousStatus,
            newStatus: item.NewStatus,
            timestamp: new Date(item.Timestamp),
            changedBy: item.ChangedBy
          };
        })
      );
      
      setHistory(historyWithWardNames);
    } catch (err) {
      console.error('Error fetching history:', err);
      throw err;
    }
  };

  return { history, loading, error, fetchHistory };
};