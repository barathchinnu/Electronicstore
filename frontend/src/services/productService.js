import api from './api';

export const getProducts = (params = {}) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const uploadProductImages = (formData) =>
  api.post('/products/upload/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const addReview = (id, data) => api.post(`/products/${id}/reviews`, data);
