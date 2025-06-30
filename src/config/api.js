// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: '/auth',
    contabox: '/api/v1',
    reports: '/api/v1/reports',
    calculation: '/api/v1/calculation'
  }
};

export default API_BASE_URL;