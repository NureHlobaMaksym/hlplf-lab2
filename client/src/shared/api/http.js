import { env } from '../config/env';

let authToken = '';

export const setAuthToken = (token) => {
  authToken = token || '';
};

const withJsonHeaders = (options = {}) => ({
  headers: {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(options.headers || {})
  },
  ...options
});

const request = async (path, options = {}) => {
  const response = await fetch(`${env.apiUrl}${path}`, withJsonHeaders(options));
  const hasBody = response.status !== 204;
  const payload = hasBody ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || 'Request failed');
  }

  return payload;
};

export const http = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' })
};
