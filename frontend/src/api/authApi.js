import axiosClient from './axiosClient';

export const authApi = {
  login: (credentials) => axiosClient.post('/auth/login', credentials),
  register: (userData) => axiosClient.post('/auth/register', userData),
  forgotPassword: (data) => axiosClient.post('/auth/forgot-password', data),
  changePassword: (data) => axiosClient.post('/auth/change-password', data),
  getMe: () => axiosClient.get('/auth/me'),
};
