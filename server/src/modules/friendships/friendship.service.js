const { friendshipRepository } = require('./friendship.repository');
const { userRepository } = require('../users/user.repository');
const { userService } = require('../users/user.service');
const { messageRepository } = require('../messages/message.repository');
const { AppError } = require('../../common/errors/app-error');
const { HTTP_STATUS } = require('../../constants/http-status');
const { MESSAGES } = require('../../constants/messages');
const { FRIEND_REQUEST_STATUS } = require('../../constants/social');

class FriendshipService {
  static instance;

  static getInstance() {
    if (!FriendshipService.instance) {
      FriendshipService.instance = new FriendshipService();
    }

    return FriendshipService.instance;
  }

  async areFriends(userId, peerId) {
    const relation = await friendshipRepository.findRelation(Number(userId), Number(peerId));
    return Boolean(relation && relation.status === FRIEND_REQUEST_STATUS.ACCEPTED);
  }

  async sendRequest(currentUserId, friendId) {
    if (Number(currentUserId) === Number(friendId)) {
      throw new AppError('You cannot add yourself', HTTP_STATUS.BAD_REQUEST);
    }

    const [user, friend] = await Promise.all([
      userRepository.findById(Number(currentUserId)),
      userRepository.findById(Number(friendId))
    ]);

    if (!user || !friend) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const existing = await friendshipRepository.findRelation(user.id, friend.id);
    if (existing) {
      if (existing.status === FRIEND_REQUEST_STATUS.PENDING) {
        throw new AppError('Friend request already exists', HTTP_STATUS.CONFLICT);
      }

      if (existing.status === FRIEND_REQUEST_STATUS.ACCEPTED) {
        throw new AppError('Users are already friends', HTTP_STATUS.CONFLICT);
      }

      if (existing.status === FRIEND_REQUEST_STATUS.REJECTED) {
        existing.status = FRIEND_REQUEST_STATUS.PENDING;
        existing.user = user;
        existing.friend = friend;
        existing.respondedAt = null;
        return friendshipRepository.save(existing);
      }
    }

    return friendshipRepository.create({
      user,
      friend,
      status: FRIEND_REQUEST_STATUS.PENDING
    });
  }

  async acceptRequest(currentUserId, requestId) {
    const request = await friendshipRepository.findById(Number(requestId));

    if (!request || request.status !== FRIEND_REQUEST_STATUS.PENDING) {
      throw new AppError('Friend request not found', HTTP_STATUS.NOT_FOUND);
    }

    if (request.friend.id !== Number(currentUserId)) {
      throw new AppError(MESSAGES.ACCESS_DENIED, HTTP_STATUS.FORBIDDEN);
    }

    request.status = FRIEND_REQUEST_STATUS.ACCEPTED;
    request.respondedAt = new Date();

    return friendshipRepository.save(request);
  }

  async rejectRequest(currentUserId, requestId) {
    const request = await friendshipRepository.findById(Number(requestId));

    if (!request || request.status !== FRIEND_REQUEST_STATUS.PENDING) {
      throw new AppError('Friend request not found', HTTP_STATUS.NOT_FOUND);
    }

    if (request.friend.id !== Number(currentUserId)) {
      throw new AppError(MESSAGES.ACCESS_DENIED, HTTP_STATUS.FORBIDDEN);
    }

    request.status = FRIEND_REQUEST_STATUS.REJECTED;
    request.respondedAt = new Date();

    return friendshipRepository.save(request);
  }

  async getIncoming(currentUserId) {
    const requests = await friendshipRepository.findIncomingPending(Number(currentUserId));

    return requests.map((item) => ({
      id: item.id,
      createdAt: item.createdAt,
      from: userService.toPublicUser(item.user)
    }));
  }

  async getOutgoing(currentUserId) {
    const requests = await friendshipRepository.findOutgoingPending(Number(currentUserId));

    return requests.map((item) => ({
      id: item.id,
      createdAt: item.createdAt,
      to: userService.toPublicUser(item.friend)
    }));
  }

  async getFriends(currentUserId) {
    const relations = await friendshipRepository.findAcceptedByUserId(Number(currentUserId));

    return relations.map((item) => {
      const friend = item.user.id === Number(currentUserId) ? item.friend : item.user;
      return userService.toPublicUser(friend);
    });
  }

  async removeFriend(currentUserId, friendId) {
    const relation = await friendshipRepository.findRelation(Number(currentUserId), Number(friendId));

    if (!relation || relation.status !== FRIEND_REQUEST_STATUS.ACCEPTED) {
      throw new AppError(MESSAGES.FRIENDSHIP_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    await friendshipRepository.remove(relation.id);
    await messageRepository.deleteConversation(Number(currentUserId), Number(friendId));
  }
}

module.exports = { friendshipService: FriendshipService.getInstance() };
