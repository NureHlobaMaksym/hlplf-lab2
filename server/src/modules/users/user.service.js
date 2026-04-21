const { userRepository } = require('./user.repository');
const { AppError } = require('../../common/errors/app-error');
const { HTTP_STATUS } = require('../../constants/http-status');
const { MESSAGES } = require('../../constants/messages');
const { ALLOW_MESSAGES_FROM, FRIEND_REQUEST_STATUS } = require('../../constants/social');
const { friendshipRepository } = require('../friendships/friendship.repository');

class UserService {
  static instance;

  static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }

    return UserService.instance;
  }

  toPublicUser(user) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      allowMessagesFrom: user.allowMessagesFrom,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async canMessage(currentUserId, targetUser) {
    if (Number(currentUserId) === Number(targetUser.id)) {
      return false;
    }

    if (targetUser.allowMessagesFrom === ALLOW_MESSAGES_FROM.ALL) {
      return true;
    }

    const relation = await friendshipRepository.findRelation(Number(currentUserId), Number(targetUser.id));
    return Boolean(relation && relation.status === FRIEND_REQUEST_STATUS.ACCEPTED);
  }

  async isFriend(currentUserId, targetUserId) {
    const relation = await friendshipRepository.findRelation(Number(currentUserId), Number(targetUserId));
    return Boolean(relation && relation.status === FRIEND_REQUEST_STATUS.ACCEPTED);
  }

  async searchUsers(query, currentUserId) {
    const normalizedQuery = (query || '').trim();
    const users = normalizedQuery ? await userRepository.searchByQuery(normalizedQuery) : await userRepository.findAll();
    const result = [];

    for (const user of users) {
      const publicUser = this.toPublicUser(user);
      publicUser.isFriend = await this.isFriend(currentUserId, user.id);
      publicUser.canMessage =
        targetUserAllowAll(user) || publicUser.isFriend;
      result.push(publicUser);
    }

    return result;
  }

  async getUserById(id, currentUserId = null) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const publicUser = this.toPublicUser(user);
    if (currentUserId !== null) {
      publicUser.isFriend = await this.isFriend(currentUserId, user.id);
      publicUser.canMessage = targetUserAllowAll(user) || publicUser.isFriend;
    }

    return publicUser;
  }

  async updatePrivacy(userId, allowMessagesFrom) {
    if (![ALLOW_MESSAGES_FROM.ALL, ALLOW_MESSAGES_FROM.FRIENDS].includes(allowMessagesFrom)) {
      throw new AppError('allowMessagesFrom must be all or friends', HTTP_STATUS.BAD_REQUEST);
    }

    const user = await userRepository.findById(Number(userId));

    if (!user) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    user.allowMessagesFrom = allowMessagesFrom;
    const saved = await userRepository.save(user);

    return this.toPublicUser(saved);
  }
}

const targetUserAllowAll = (user) => user.allowMessagesFrom === ALLOW_MESSAGES_FROM.ALL;

module.exports = { userService: UserService.getInstance() };
