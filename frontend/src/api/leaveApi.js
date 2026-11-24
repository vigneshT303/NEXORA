import axiosClient from './axiosClient';

export const leaveApi = {
  apply: (data) => axiosClient.post('/leaves', data),
  getMyLeaves: () => axiosClient.get('/leaves/my-leaves'),
  getAll: () => axiosClient.get('/leaves'),
  approve: (id, remarks) => axiosClient.put(`/leaves/${id}/approve`, { remarks }),
  reject: (id, remarks) => axiosClient.put(`/leaves/${id}/reject`, { remarks }),
};
