import { useState, useEffect } from 'react';
import { getAuthHeaders } from '../sharepoint/sharepointAuth'; 
import { getApiEndpoint } from '../sharepoint/sharepointConfig';

export const useSharePoint = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generic fetch function for SharePoint API
  const fetchFromSharePoint = async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const defaultOptions = {
        headers: {
          ...getAuthHeaders(),
          ...options.headers
        },
        credentials: 'include'
      };
      
      const response = await fetch(endpoint, { ...defaultOptions, ...options });
      
      if (!response.ok) {
        throw new Error(`SharePoint API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.d || data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get all items from a list
  const getListItems = async (listName, filter = '') => {
    const endpoint = `${getApiEndpoint(listName)}/items${filter ? `?$filter=${encodeURIComponent(filter)}` : ''}`;
    const data = await fetchFromSharePoint(endpoint);
    return data.results || [];
  };

  // Add item to a list - REMOVE REQUEST DIGEST LOGIC
  const addListItem = async (listName, itemData) => {
    const endpoint = `${getApiEndpoint(listName)}/items`;
    
    return await fetchFromSharePoint(endpoint, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(itemData)
    });
  };

  // Update list item - REMOVE REQUEST DIGEST LOGIC
  const updateListItem = async (listName, itemId, itemData) => {
    const endpoint = `${getApiEndpoint(listName)}/items(${itemId})`;
    
    return await fetchFromSharePoint(endpoint, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'X-HTTP-Method': 'MERGE',
        'IF-MATCH': '*'
      },
      body: JSON.stringify(itemData)
    });
  };

  // Delete list item - REMOVE REQUEST DIGEST LOGIC
  const deleteListItem = async (listName, itemId) => {
    const endpoint = `${getApiEndpoint(listName)}/items(${itemId})`;
    
    return await fetchFromSharePoint(endpoint, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'X-HTTP-Method': 'DELETE',
        'IF-MATCH': '*'
      }
    });
  };

  return {
    loading,
    error,
    getListItems,
    addListItem,
    updateListItem,
    deleteListItem
  };
};