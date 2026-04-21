const { dataSource } = require('../../config/database');

class UserRepository {
  static instance;

  static getInstance() {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }

    return UserRepository.instance;
  }

  get repo() {
    return dataSource.getRepository('User');
  }

  async create(payload) {
    const entity = this.repo.create(payload);
    return this.repo.save(entity);
  }

  async save(entity) {
    return this.repo.save(entity);
  }

  async findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id) {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email) {
    return this.repo.findOne({ where: { email } });
  }

  async searchByQuery(query) {
    const q = `%${query.toLowerCase()}%`;

    return this.repo
      .createQueryBuilder('user')
      .where('LOWER(user.firstName) LIKE :q', { q })
      .orWhere('LOWER(user.lastName) LIKE :q', { q })
      .orWhere('LOWER(user.email) LIKE :q', { q })
      .orderBy('user.createdAt', 'DESC')
      .getMany();
  }
}

module.exports = { userRepository: UserRepository.getInstance() };
