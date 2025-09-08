import SHAREPOINT_CONFIG from './sharepointConfig';

// For proxy authentication
export const getAuthHeaders = () => {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
};

// Check SharePoint authentication
export const checkSharePointAuth = async () => {
  try {
    // Test the proxy server first
    const healthResponse = await fetch(
      `${SHAREPOINT_CONFIG.proxyUrl}/api/health`,
      
      {
        method: 'GET',
        headers: getAuthHeaders()
      }
    );
    
    if (!healthResponse.ok) {
      throw new Error(`Proxy server not responding: ${healthResponse.status}`);
    }
    
    // Test SharePoint connection through proxy
    const response = await fetch(
      `${SHAREPOINT_CONFIG.proxyUrl}/api/test-connection`,
      {
        method: 'GET',
        headers: getAuthHeaders()
      }
    );
    
    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return true;
  } catch (error) {
    console.error('SharePoint authentication error:', error);
    throw new Error(`Cannot connect to SharePoint: ${error.message}`);
  }
};