import { useState, useEffect } from 'react';
import { useSharePoint } from './useSharePoint';

export const useRooms = (wardId) => {
  const [rooms, setRooms] = useState([]);
  const { getListItems, updateListItem, addListItem, loading, error } = useSharePoint();

  useEffect(() => {
    if (!wardId) return;

    const fetchRooms = async () => {
      try {
        const filter = `WardId eq ${wardId}`;
        const roomsData = await getListItems('rooms', filter);
        
        const formattedRooms = roomsData.map(room => ({
          id: room.Id,
          roomNumber: room.Title,
          status: room.Status?.toLowerCase() || 'available',
          lastUpdated: room.LastUpdated
        }));
        
        setRooms(formattedRooms);
      } catch (err) {
        console.error('Error fetching rooms:', err);
      }
    };

    fetchRooms();
    
    // Set up polling
    const interval = setInterval(fetchRooms, 30000);
    
    return () => clearInterval(interval);
  }, [wardId]);

  const updateRoomStatus = async (roomId, newStatus, timestamp) => {
    try {
      // Update room status
      await updateListItem('rooms', roomId, {
        Status: newStatus,
        LastUpdated: timestamp.toISOString()
      });
      
      // Add to history
      await addListItem('history', {
        RoomId: roomId,
        WardId: wardId,
        PreviousStatus: rooms.find(r => r.id === roomId)?.status || 'unknown',
        NewStatus: newStatus,
        Timestamp: timestamp.toISOString(),
        ChangedBy: 'system'
      });
      
      // Refresh rooms data
      const filter = `WardId eq ${wardId}`;
      const roomsData = await getListItems('rooms', filter);
      const formattedRooms = roomsData.map(room => ({
        id: room.Id,
        roomNumber: room.Title,
        status: room.Status?.toLowerCase() || 'available',
        lastUpdated: room.LastUpdated
      }));
      setRooms(formattedRooms);
    } catch (err) {
      console.error('Error updating room status:', err);
      throw err;
    }
  };

  const clearAllRooms = async () => {
    try {
      const timestamp = new Date();
      
      // Update all rooms to available
      const updatePromises = rooms.map(room => 
        updateListItem('rooms', room.id, {
          Status: 'available',
          LastUpdated: timestamp.toISOString()
        })
      );
      
      // Add history entries
      const historyPromises = rooms.map(room =>
        addListItem('history', {
          RoomId: room.id,
          WardId: wardId,
          PreviousStatus: room.status,
          NewStatus: 'available',
          Timestamp: timestamp.toISOString(),
          ChangedBy: 'system'
        })
      );
      
      await Promise.all([...updatePromises, ...historyPromises]);
      
      // Refresh data
      const filter = `WardId eq ${wardId}`;
      const roomsData = await getListItems('rooms', filter);
      const formattedRooms = roomsData.map(room => ({
        id: room.Id,
        roomNumber: room.Title,
        status: room.Status?.toLowerCase() || 'available',
        lastUpdated: room.LastUpdated
      }));
      setRooms(formattedRooms);
    } catch (err) {
      console.error('Error clearing all rooms:', err);
      throw err;
    }
  };

  return { rooms, loading, error, updateRoomStatus, clearAllRooms };
};