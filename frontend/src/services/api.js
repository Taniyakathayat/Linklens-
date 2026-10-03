import axios from 'axios';

// Connect to FastAPI backend with flexible fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const api = {
  // System Health
  async getHealth() {
    const res = await apiClient.get('/health');
    return res.data;
  },

  // Perform Scan
  async performScan(identifier, type = 'email') {
    const res = await apiClient.post('/scan', { identifier, type });
    return res.data;
  },

  // Retrieve previous scan by ID
  async getScanById(scanId) {
    const res = await apiClient.get(`/scan/${scanId}`);
    return res.data;
  },

  // Retrieve privacy-preserved scan history
  async getHistory() {
    const res = await apiClient.get('/history');
    return res.data;
  },

  // Clear local scan history
  async clearHistory() {
    const res = await apiClient.delete('/history');
    return res.data;
  },

  // Dashboard Aggregated Metrics
  async getDashboardMetrics() {
    const res = await apiClient.get('/dashboard');
    return res.data;
  },

  // Categorized Security Tips
  async getSecurityTips() {
    const res = await apiClient.get('/security-tips');
    return res.data;
  },
};

export default api;
