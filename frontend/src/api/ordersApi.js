import api from './axiosInstance';

export const fetchOrders = (params = {}) => api.get('/orders', { params });

export const fetchOrder = (id) => api.get(`/orders/${id}`);

export const createOrder = (data) => api.post('/orders', data);

export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });

export const cancelOrder = (id) => api.put(`/orders/${id}/cancel`);

export const deleteOrder = (id) => api.delete(`/orders/${id}`);
