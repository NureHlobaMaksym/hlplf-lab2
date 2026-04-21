import { http } from '../../shared/api/http';

export const usersApi = {
  search: async (query) => (await http.get(`/users/search?q=${encodeURIComponent(query)}`)).data,
  getById: async (id) => (await http.get(`/users/${id}`)).data,
  getProfile: async (id) => (await http.get(`/users/${id}/profile`)).data,
  updatePrivacy: async (allowMessagesFrom) => (await http.patch('/users/me/privacy', { allowMessagesFrom })).data
};
