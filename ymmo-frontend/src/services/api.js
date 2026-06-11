import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const bienService = {
  getAll: () => api.get('/biens'),
  getById: (id) => api.get(`/biens/${id}`),
  getByVille: (ville) => api.get(`/biens/ville/${ville}`),
  getByType: (type) => api.get(`/biens/type/${type}`),
  create: (data) => api.post('/biens', data),
  update: (id, data) => api.put(`/biens/${id}`, data),
  delete: (id) => api.delete(`/biens/${id}`),
};

export default api;