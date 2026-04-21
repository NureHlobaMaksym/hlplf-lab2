const { dataSource } = require('../../config/database');
const { FRIEND_REQUEST_STATUS } = require('../../constants/social');

class FriendshipRepository {
  static instance;

  static getInstance() {
    if (!FriendshipRepository.instance) {
      FriendshipRepository.instance = new FriendshipRepository();
    }

    return FriendshipRepository.instance;
  }

  get repo() {
    return dataSource.getRepository('Friendship');
  }

  async create(payload) {
    const entity = this.repo.create(payload);
    return this.repo.save(entity);
  }

  async save(entity) {
    return this.repo.save(entity);
  }

  async findById(id) {
    return this.repo.findOne({ where: { id }, relations: ['user', 'friend'] });
  }

  async findRelation(userId, friendId) {
    return this.repo.findOne({
      where: [
        { user: { id: userId }, friend: { id: friendId } },
        { user: { id: friendId }, friend: { id: userId } }
      ],
      relations: ['user', 'friend']
    });
  }

  async findIncomingPending(userId) {
    return this.repo.find({
      where: { friend: { id: userId }, status: FRIEND_REQUEST_STATUS.PENDING },
      relations: ['user', 'friend'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOutgoingPending(userId) {
    return this.repo.find({
      where: { user: { id: userId }, status: FRIEND_REQUEST_STATUS.PENDING },
      relations: ['user', 'friend'],
      order: { createdAt: 'DESC' }
    });
  }

  async findAcceptedByUserId(userId) {
    return this.repo.find({
      where: [
        { user: { id: userId }, status: FRIEND_REQUEST_STATUS.ACCEPTED },
        { friend: { id: userId }, status: FRIEND_REQUEST_STATUS.ACCEPTED }
      ],
      relations: ['user', 'friend'],
      order: { respondedAt: 'DESC' }
    });
  }

  async remove(id) {
    await this.repo.delete(id);
  }
}

module.exports = { friendshipRepository: FriendshipRepository.getInstance() };
