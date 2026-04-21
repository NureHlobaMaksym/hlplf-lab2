const { messageRepository } = require('./message.repository');
const { userRepository } = require('../users/user.repository');
const { userService } = require('../users/user.service');
const { friendshipService } = require('../friendships/friendship.service');
const { friendshipRepository } = require('../friendships/friendship.repository');
const { AppError } = require('../../common/errors/app-error');
const { HTTP_STATUS } = require('../../constants/http-status');
const { MESSAGES } = require('../../constants/messages');
const { ALLOW_MESSAGES_FROM, FRIEND_REQUEST_STATUS } = require('../../constants/social');

class MessageService {
  static instance;

  static getInstance() {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }

    return MessageService.instance;
  }

  normalizeMessage(message) {
    return {
      ...message,
      sender: userService.toPublicUser(message.sender),
      receiver: userService.toPublicUser(message.receiver)
    };
  }

  async assertCanSend(senderId, receiver) {
    if (receiver.allowMessagesFrom === ALLOW_MESSAGES_FROM.ALL) {
      return;
    }

    const isFriend = await friendshipService.areFriends(senderId, receiver.id);
    if (!isFriend) {
      throw new AppError('This user accepts messages only from friends', HTTP_STATUS.FORBIDDEN);
    }
  }

  async ensureAutoFriendship(sender, receiver) {
    const relation = await friendshipRepository.findRelation(sender.id, receiver.id);

    if (!relation) {
      await friendshipRepository.create({
        user: sender,
        friend: receiver,
        status: FRIEND_REQUEST_STATUS.ACCEPTED,
        respondedAt: new Date()
      });
      return;
    }

    if (relation.status !== FRIEND_REQUEST_STATUS.ACCEPTED) {
      relation.status = FRIEND_REQUEST_STATUS.ACCEPTED;
      relation.respondedAt = new Date();
      await friendshipRepository.save(relation);
    }
  }

  async sendMessage(payload) {
    if (Number(payload.senderId) === Number(payload.receiverId)) {
      throw new AppError('You cannot send message to yourself', HTTP_STATUS.BAD_REQUEST);
    }

    const sender = await userRepository.findById(Number(payload.senderId));
    const receiver = await userRepository.findById(Number(payload.receiverId));

    if (!sender || !receiver) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    await this.assertCanSend(sender.id, receiver);

    const saved = await messageRepository.create({
      sender,
      receiver,
      content: payload.content.trim(),
      isRead: false
    });

    await this.ensureAutoFriendship(sender, receiver);

    const withRelations = await messageRepository.findById(saved.id);
    return this.normalizeMessage(withRelations);
  }

  async getConversation(currentUserId, peerUserId) {
    const userA = await userRepository.findById(Number(currentUserId));
    const userB = await userRepository.findById(Number(peerUserId));

    if (!userA || !userB) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const messages = await messageRepository.findConversation(Number(currentUserId), Number(peerUserId));
    return messages.map((message) => this.normalizeMessage(message));
  }

  async markConversationRead(currentUserId, peerUserId) {
    await messageRepository.markConversationRead(Number(currentUserId), Number(peerUserId));
  }

  async markMessageRead(messageId) {
    await messageRepository.markMessageRead(Number(messageId));
  }

  async getChats(currentUserId) {
    const messages = await messageRepository.getChats(Number(currentUserId));
    const map = new Map();

    for (const message of messages) {
      const peer = message.sender.id === Number(currentUserId) ? message.receiver : message.sender;
      const existing = map.get(peer.id);

      if (!existing) {
        map.set(peer.id, {
          peer: userService.toPublicUser(peer),
          lastMessage: this.normalizeMessage(message),
          unreadCount: 0
        });
      }

      if (message.receiver.id === Number(currentUserId) && !message.isRead) {
        const value = map.get(peer.id);
        value.unreadCount += 1;
        map.set(peer.id, value);
      }
    }

    return Array.from(map.values());
  }

  async deleteConversation(currentUserId, peerUserId) {
    const userA = await userRepository.findById(Number(currentUserId));
    const userB = await userRepository.findById(Number(peerUserId));

    if (!userA || !userB) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    await messageRepository.deleteConversation(Number(currentUserId), Number(peerUserId));
  }
}

module.exports = { messageService: MessageService.getInstance() };
