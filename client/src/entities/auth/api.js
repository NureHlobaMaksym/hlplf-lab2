import { http } from '../../shared/api/http';

export const authApi = {
  register: async (payload) => (await http.post('/auth/register', payload)).data,
  login: async (payload) => (await http.post('/auth/login', payload)).data,
  me: async () => (await http.get('/auth/me')).data
};
