import { http } from '../../shared/api/http';

export const messagesApi = {
  chats: async () => (await http.get('/messages/chats')).data,
  getConversation: async (peerUserId) => (await http.get(`/messages/conversation/${peerUserId}`)).data,
  deleteConversation: async (peerUserId) => http.delete(`/messages/conversation/${peerUserId}`),
  markRead: async (peerUserId) => http.post(`/messages/conversation/${peerUserId}/read`, {}),
  create: async (payload) => (await http.post('/messages', payload)).data
};
