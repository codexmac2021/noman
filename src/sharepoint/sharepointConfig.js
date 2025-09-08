const SHAREPOINT_CONFIG = {
  // Use proxy instead of direct SharePoint URL
  proxyUrl: 'http://localhost:3001',

};

// Helper function to get API endpoints
export const getApiEndpoint = (listName) => {
  return `${SHAREPOINT_CONFIG.proxyUrl}/api/sharepoint${SHAREPOINT_CONFIG.lists[listName]}`;
};

export default SHAREPOINT_CONFIG;