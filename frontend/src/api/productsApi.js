import api from './axiosInstance';

export const fetchProducts = (params = {}) => api.get('/products', { params });

export const fetchProduct = (id) => api.get(`/products/${id}`);

export const createProduct = (data) => api.post('/products', data);

export const updateProduct = (id, data) => api.put(`/products/${id}`, data);

export const deleteProduct = (id) => api.delete(`/products/${id}`);
