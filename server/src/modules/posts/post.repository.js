const { dataSource } = require('../../config/database');

class PostRepository {
  static instance;

  static getInstance() {
    if (!PostRepository.instance) {
      PostRepository.instance = new PostRepository();
    }

    return PostRepository.instance;
  }

  get repo() {
    return dataSource.getRepository('Post');
  }

  async create(payload) {
    const entity = this.repo.create(payload);
    return this.repo.save(entity);
  }

  async save(entity) {
    return this.repo.save(entity);
  }

  async findAll() {
    return this.repo.find({
      relations: ['author', 'comments', 'comments.author'],
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id) {
    return this.repo.findOne({
      where: { id },
      relations: ['author', 'comments', 'comments.author']
    });
  }

  async remove(id) {
    return this.repo.delete(id);
  }
}

module.exports = { postRepository: PostRepository.getInstance() };
