import { http } from '../../shared/api/http';

export const postsApi = {
  getAll: async (query = '') => (await http.get(`/posts${query ? `?q=${encodeURIComponent(query)}` : ''}`)).data,
  getById: async (id) => (await http.get(`/posts/${id}`)).data,
  create: async (payload) => (await http.post('/posts', payload)).data,
  update: async (id, payload) => (await http.patch(`/posts/${id}`, payload)).data,
  remove: async (id) => http.delete(`/posts/${id}`)
};
