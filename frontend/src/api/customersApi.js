import api from './axiosInstance';

export const fetchCustomers = (params = {}) => api.get('/customers', { params });

export const fetchCustomer = (id) => api.get(`/customers/${id}`);

export const createCustomer = (data) => api.post('/customers', data);

export const deleteCustomer = (id) => api.delete(`/customers/${id}`);
