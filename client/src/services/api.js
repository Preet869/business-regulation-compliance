import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001', // Use direct connection to backend
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Business API endpoints
export const businessAPI = {
  // Get all businesses with filters
  getBusinesses: (filters = {}) => api.get('/api/business', { params: filters }),
  
  // Get business by ID
  getBusiness: (id) => api.get(`/api/business/${id}`),
  
  // Create new business
  createBusiness: (businessData) => api.post('/api/business', businessData),
  
  // Update business
  updateBusiness: (id, businessData) => api.put(`/api/business/${id}`, businessData),
  
  // Delete business
  deleteBusiness: (id) => api.delete(`/api/business/${id}`),
  
  // Get business statistics
  getStats: () => api.get('/api/business/stats/overview'),
};

// Compliance API endpoints
export const complianceAPI = {
  // Check compliance for a business
  checkCompliance: (businessData) => api.post('/api/compliance/check', businessData),
  
  // Get compliance history for a business
  getComplianceHistory: (businessId) => api.get(`/api/compliance/history/${businessId}`),
  
  // Save compliance result
  saveComplianceResult: (complianceData) => api.post('/api/compliance/save', complianceData),
};

// Regulations API endpoints
export const regulationsAPI = {
  // Get all regulations with filters
  getRegulations: (filters = {}) => api.get('/api/regulations', { params: filters }),
  
  // Get regulation by ID
  getRegulation: (id) => api.get(`/api/regulations/${id}`),
  
  // Search regulations
  searchRegulations: (query) => api.get('/api/regulations/search', { params: { q: query } }),
  
  // Get regulation categories
  getCategories: () => api.get('/api/regulations/categories/list'),
  
  // Get regulation jurisdictions
  getJurisdictions: () => api.get('/api/regulations/jurisdictions/list'),
};

// GraphQL endpoint
export const graphqlAPI = {
  query: (query, variables = {}) => 
    api.post('/graphql', { query, variables }),
};

export default api;
