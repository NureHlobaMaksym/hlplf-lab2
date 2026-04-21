const { dataSource } = require('../../config/database');

class MessageRepository {
  static instance;

  static getInstance() {
    if (!MessageRepository.instance) {
      MessageRepository.instance = new MessageRepository();
    }

    return MessageRepository.instance;
  }

  get repo() {
    return dataSource.getRepository('Message');
  }

  async create(payload) {
    const entity = this.repo.create(payload);
    return this.repo.save(entity);
  }

  async save(entity) {
    return this.repo.save(entity);
  }

  async findById(id) {
    return this.repo.findOne({
      where: { id },
      relations: ['sender', 'receiver']
    });
  }

  async findConversation(userAId, userBId) {
    return this.repo.find({
      where: [
        { sender: { id: userAId }, receiver: { id: userBId } },
        { sender: { id: userBId }, receiver: { id: userAId } }
      ],
      relations: ['sender', 'receiver'],
      order: { createdAt: 'ASC' }
    });
  }

  async markConversationRead(receiverId, senderId) {
    await this.repo
      .createQueryBuilder()
      .update('Message')
      .set({ isRead: true })
      .where('"receiverId" = :receiverId', { receiverId })
      .andWhere('"senderId" = :senderId', { senderId })
      .andWhere('"isRead" = false')
      .execute();
  }

  async markMessageRead(messageId) {
    await this.repo
      .createQueryBuilder()
      .update('Message')
      .set({ isRead: true })
      .where('id = :messageId', { messageId })
      .execute();
  }

  async getChats(userId) {
    return this.repo
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .where('sender.id = :userId OR receiver.id = :userId', { userId })
      .orderBy('message.createdAt', 'DESC')
      .getMany();
  }

  async deleteConversation(userAId, userBId) {
    await this.repo
      .createQueryBuilder()
      .delete()
      .from('Message')
      .where(
        '("senderId" = :userAId AND "receiverId" = :userBId) OR ("senderId" = :userBId AND "receiverId" = :userAId)',
        { userAId, userBId }
      )
      .execute();
  }
}

module.exports = { messageRepository: MessageRepository.getInstance() };
