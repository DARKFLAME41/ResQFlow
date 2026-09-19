import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to attach Auth JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('resqflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const demoUser = localStorage.getItem('resqflow_user');
  if (demoUser) {
    config.headers['x-demo-user'] = demoUser;
  }
  return config;
});

export default api;

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me')
};

export const incidentAPI = {
  create: (data) => api.post('/incidents', data),
  getAll: (params) => api.get('/incidents', { params }),
  getById: (id) => api.get(`/incidents/${id}`),
  updateStatus: (id, data) => api.put(`/incidents/${id}/status`, data),
  assignResponder: (id, responderId) => api.post(`/incidents/${id}/assign`, { responderId }),
  accept: (id) => api.post(`/incidents/${id}/accept`),
  delete: (id) => api.delete(`/incidents/${id}`),
  resetDemo: () => api.get('/incidents/reset-demo')
};

export const resourceAPI = {
  getAll: (params) => api.get('/resources', { params }),
  getNearby: (lat, lon) => api.get('/resources/nearby', { params: { lat, lon } })
};

export const responderAPI = {
  getAll: (params) => api.get('/responders', { params }),
  getNearby: (lat, lon) => api.get('/responders/nearby', { params: { lat, lon } }),
  updateStatus: (id, data) => api.put(`/responders/${id}/status`, data)
};

export const aiAPI = {
  analyzeText: (data) => api.post('/ai/analyze', data),
  analyzeImage: (data) => api.post('/ai/analyze-image', data),
  generateFollowUp: (data) => api.post('/ai/follow-up', data)
};

export const analyticsAPI = {
  getMetrics: () => api.get('/analytics')
};
