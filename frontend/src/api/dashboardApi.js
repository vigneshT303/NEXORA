import axiosClient from './axiosClient';

export const dashboardApi = {
  getStats: () => axiosClient.get('/dashboard/stats'),
};

export const notificationApi = {
  getAll: () => axiosClient.get('/notifications'),
  markRead: (id) => axiosClient.put(`/notifications/${id}/read`),
  markAllRead: () => axiosClient.put('/notifications/read-all'),
};
