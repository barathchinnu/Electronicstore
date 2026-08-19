import api from './api';

export const createOrder = (data) => api.post('/orders', data);
export const getOrders = (params = {}) => api.get('/orders', { params });
export const getMyOrders = () => api.get('/orders/my');
export const updateOrderStatus = (id, data) => api.put(`/orders/${id}`, data);
export const getAdminStats = () => api.get('/admin/stats');
export const getAdminUsers = (params = {}) => api.get('/admin/users', { params });
export const deleteAdminUser = (id) => api.delete(`/admin/users/${id}`);
