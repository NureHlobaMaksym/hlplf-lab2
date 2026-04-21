import { http } from '../../shared/api/http';

export const friendshipsApi = {
  sendRequest: async (friendId) => (await http.post('/friendships/requests', { friendId })).data,
  incoming: async () => (await http.get('/friendships/requests/incoming')).data,
  outgoing: async () => (await http.get('/friendships/requests/outgoing')).data,
  accept: async (requestId) => (await http.post(`/friendships/requests/${requestId}/accept`, {})).data,
  reject: async (requestId) => (await http.post(`/friendships/requests/${requestId}/reject`, {})).data,
  friends: async () => (await http.get('/friendships/friends')).data,
  removeFriend: async (friendId) => http.delete(`/friendships/friends/${friendId}`)
};
