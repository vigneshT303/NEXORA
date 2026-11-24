import axiosClient from './axiosClient';

export const attendanceApi = {
  checkIn: (notes) => axiosClient.post('/attendance/check-in', { notes }),
  checkOut: (notes) => axiosClient.post('/attendance/check-out', { notes }),
  getToday: () => axiosClient.get('/attendance/today'),
  getMyHistory: () => axiosClient.get('/attendance/my-history'),
  getAll: (date) => axiosClient.get('/attendance', { params: { date } }),
  getRange: (startDate, endDate) => axiosClient.get('/attendance/range', { params: { startDate, endDate } }),
};
