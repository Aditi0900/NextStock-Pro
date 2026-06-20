import api from './axiosInstance';

export const fetchDashboardStats = () => api.get('/dashboard/stats');
