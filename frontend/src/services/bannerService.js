import api from './api';

export const getBanners = () => api.get('/banners');
export const getAdminBanners = () => api.get('/banners/admin');
export const createBanner = (data) => api.post('/banners', data);
export const updateBanner = (id, data) => api.put(`/banners/${id}`, data);
export const deleteBanner = (id) => api.delete(`/banners/${id}`);
export const uploadBannerImage = (formData) =>
  api.post('/banners/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
