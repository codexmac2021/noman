// proxy-server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PROXY_PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
}));


app.use(express.json());

// SharePoint configuration
const SHAREPOINT_CONFIG = {
  siteUrl: 'https://portal.seha.ae/aanr/Test',
  lists: {
    wards: '/_api/web/lists/getbytitle("Wards")',
    rooms: '/_api/web/lists/getbytitle("Rooms")',
    history: '/_api/web/lists/getbytitle("StatusHistory")'
  }
};

// Helper function to get API endpoints
const getApiEndpoint = (listName) => {
  return `${SHAREPOINT_CONFIG.siteUrl}${SHAREPOINT_CONFIG.lists[listName]}`;
};

// Authentication headers
const getAuthHeaders = () => {
  const auth = Buffer.from(
    `${process.env.SHAREPOINT_USERNAME}:${process.env.SHAREPOINT_PASSWORD}`
  ).toString('base64');
  
  return {
    'Accept': 'application/json;odata=verbose',
    'Content-Type': 'application/json;odata=verbose',
    'Authorization': `Basic ${auth}`
  };
};

// Generic proxy endpoint - FIXED ROUTE HANDLING
app.all('/api/sharepoint/*', async (req, res) => {
  try {
    const path = req.path.replace('/api/sharepoint', '');
    const url = `${SHAREPOINT_CONFIG.siteUrl}${path}`;
    
    console.log(`Proxying request to: ${url}`);
    
    const options = {
      method: req.method,
      headers: getAuthHeaders(),
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
    };

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`SharePoint responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ 
      error: 'Failed to connect to SharePoint',
      message: error.message 
    });
  }
});

// Health check endpoint - FIXED ROUTE
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Proxy server is running' });
});

// Test SharePoint connection endpoint - FIXED ROUTE
app.get('/api/test-connection', async (req, res) => {
  try {
    const url = `${SHAREPOINT_CONFIG.siteUrl}/_api/web/title`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`SharePoint responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    res.json({ 
      status: 'OK', 
      message: 'Successfully connected to SharePoint',
      data: data 
    });
  } catch (error) {
    console.error('Connection test error:', error.message);
    res.status(500).json({ 
      error: 'Failed to connect to SharePoint',
      message: error.message 
    });
  }
});

// Root endpoint to avoid "cannot GET /" error
app.get('/', (req, res) => {
  res.json({ 
    message: 'SharePoint Proxy Server is running',
    endpoints: {
      health: '/api/health',
      testConnection: '/api/test-connection',
      sharepoint: '/api/sharepoint/*'
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on http://0.0.0.0:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Connection test: http://localhost:${PORT}/api/test-connection`);
  console.log(`Root endpoint: http://localhost:${PORT}/`);
});