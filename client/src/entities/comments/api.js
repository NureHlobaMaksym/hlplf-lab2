import { http } from '../../shared/api/http';

export const commentsApi = {
  getByPost: async (postId) => (await http.get(`/comments/post/${postId}`)).data,
  create: async (payload) => (await http.post('/comments', payload)).data,
  remove: async (id) => http.delete(`/comments/${id}`)
};
