import axios from 'axios';
import API_BASE_URL from '../config/api.js';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación si existe
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};

// Servicios de reportes
export const reportService = {
  getReports: async (month, year) => {
    try {
      const response = await apiClient.get('/contabox/reports', {
        params: { month, year },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCalculations: async (month, year, rfc = 'SOBA901008FM4') => {
    try {
      const response = await apiClient.get(`/api/calculation/${rfc}`, {
        params: { month, year },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCalculationById: async (objectId, rfc) => {
    try {
      const url = `/api/calculation/by-id/${objectId}`;
      const params = { rfc };
      
      console.log('API Service - URL:', url);
      console.log('API Service - Params:', params);
      console.log('API Service - Base URL:', apiClient.defaults.baseURL);
      
      const response = await apiClient.get(url, { params });
      
      console.log('API Service - Response status:', response.status);
      console.log('API Service - Response data:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('API Service - Error:', error);
      console.error('API Service - Error response:', error.response);
      throw error.response?.data || error.message;
    }
  },

  getCFDIData: async (objectId, rfc, filterType = 'todos', cfdiType = 'I', section = 'entidades') => {
    try {
      const response = await apiClient.get(`/api/cfdi/${objectId}`, {
        params: { rfc, filter_type: filterType, cfdi_type: cfdiType, section },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCFDIDataByPeriod: async (month, year, rfc, filterType = 'todos', cfdiType = 'I', section = 'entidades') => {
    try {
      const response = await apiClient.get(`/api/cfdi/period`, {
        params: { month, year, rfc, filter_type: filterType, cfdi_type: cfdiType, section },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCFDISummary: async (objectId, rfc) => {
    try {
      const response = await apiClient.get(`/api/cfdi/${objectId}/summary`, {
        params: { rfc },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Servicio para obtener datos de MongoDB
export const dataService = {
  getClients: async () => {
    try {
      const response = await apiClient.get('/contabox/clients');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCalculationData: async (clientId, period) => {
    try {
      const response = await apiClient.get(`/contabox/calculation-data/${clientId}`, {
        params: { period },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default apiClient;