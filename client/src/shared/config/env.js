const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const env = {
  apiUrl,
  socketUrl: import.meta.env.VITE_SOCKET_URL || apiUrl.replace(/\/api$/, '')
};
