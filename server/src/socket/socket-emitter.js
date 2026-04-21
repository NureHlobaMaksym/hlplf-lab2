const { getIo } = require('./socket-server');

const getUserRoom = (userId) => `user:${userId}`;

const emitToUsers = (userIds, eventName, payload) => {
  const io = getIo();
  if (!io) return;

  userIds.forEach((userId) => {
    io.to(getUserRoom(userId)).emit(eventName, payload);
  });
};

module.exports = { emitToUsers };
