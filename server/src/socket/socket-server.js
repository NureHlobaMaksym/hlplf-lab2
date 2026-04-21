const { Server } = require('socket.io');
const { env } = require('../config/env');
const { authService } = require('../modules/auth/auth.service');
const { messageService } = require('../modules/messages/message.service');

let io;
const activeChatBySocket = new Map();

const getUserRoom = (userId) => `user:${userId}`;

const isUserActiveInChat = (userId, peerId) => {
  for (const [socketId, active] of activeChatBySocket.entries()) {
    if (active.userId === Number(userId) && active.peerId === Number(peerId)) {
      return true;
    }
    if (!io.sockets.sockets.has(socketId)) {
      activeChatBySocket.delete(socketId);
    }
  }

  return false;
};

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: env.clientOrigin
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Unauthorized'));
    }

    try {
      const payload = authService.verifyToken(token);
      socket.userId = payload.userId;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(getUserRoom(socket.userId));

    socket.on('chat_open', async ({ peerId }) => {
      activeChatBySocket.set(socket.id, {
        userId: Number(socket.userId),
        peerId: Number(peerId)
      });

      await messageService.markConversationRead(Number(socket.userId), Number(peerId));
      io.to(getUserRoom(socket.userId)).emit('chat_read', { peerId: Number(peerId) });
    });

    socket.on('chat_close', () => {
      activeChatBySocket.delete(socket.id);
    });

    socket.on('send_message', async (payload) => {
      try {
        const savedMessage = await messageService.sendMessage({
          senderId: socket.userId,
          receiverId: Number(payload.receiverId),
          content: payload.content
        });

        const receiverIsActiveInChat = isUserActiveInChat(Number(payload.receiverId), Number(socket.userId));

        if (receiverIsActiveInChat) {
          await messageService.markMessageRead(savedMessage.id);
          savedMessage.isRead = true;
        }

        io.to(getUserRoom(socket.userId)).to(getUserRoom(Number(payload.receiverId))).emit('new_message', savedMessage);

        if (!receiverIsActiveInChat) {
          io.to(getUserRoom(Number(payload.receiverId))).emit('chat_badge_increment', {
            peerId: Number(socket.userId)
          });
        }
      } catch (error) {
        socket.emit('message_error', error.message || 'Failed to send message');
      }
    });

    socket.on('disconnect', () => {
      activeChatBySocket.delete(socket.id);
    });
  });

  return io;
};

const getIo = () => io;

module.exports = { initSocket, getIo, isUserActiveInChat };
