# Лабораторна робота №2

SPA соцмережа (Instagram-like) на `Node.js + Express + PostgreSQL + TypeORM + React`.

## Структура

- `server` — REST API + WebSocket (модульний підхід)
- `client` — React SPA (artifact-поділ)

## Реалізовано

- реєстрація/логін (JWT)
- стрічка постів + окрема сторінка створення поста
- окрема сторінка деталей поста
- видимість постів: `public` / `friends`
- окрема сторінка пошуку користувачів
- профіль користувача з його постами
- friend requests: incoming/outgoing, accept/reject
- налаштування приватності повідомлень: писати можуть `all` або `friends`
- realtime чат через WebSocket (`socket.io`)
- лічильник нових повідомлень на вкладці чатів

## Запуск (Docker)

```bash
cd server
docker compose down
docker compose up --build
```

Повторний старт без перебілду:

```bash
docker compose up
```

## Запуск клієнта

```bash
cd client
npm install
npm run dev
```

## Основні endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/posts?q=...`
- `POST /api/posts`
- `GET /api/posts/:id`
- `DELETE /api/posts/:id`
- `POST /api/comments`
- `GET /api/comments/post/:postId`
- `GET /api/users/search?q=...`
- `GET /api/users/:id/profile`
- `PATCH /api/users/me/privacy`
- `POST /api/friendships/requests`
- `GET /api/friendships/requests/incoming`
- `GET /api/friendships/requests/outgoing`
- `POST /api/friendships/requests/:requestId/accept`
- `POST /api/friendships/requests/:requestId/reject`
- `GET /api/friendships/friends`
- `GET /api/messages/chats`
- `GET /api/messages/conversation/:peerUserId`
- `POST /api/messages/conversation/:peerUserId/read`
- `POST /api/messages`

