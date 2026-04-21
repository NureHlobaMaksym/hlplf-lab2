const { dataSource } = require('../../config/database');

class CommentRepository {
  static instance;

  static getInstance() {
    if (!CommentRepository.instance) {
      CommentRepository.instance = new CommentRepository();
    }

    return CommentRepository.instance;
  }

  get repo() {
    return dataSource.getRepository('Comment');
  }

  async create(payload) {
    const entity = this.repo.create(payload);
    return this.repo.save(entity);
  }

  async findById(id) {
    return this.repo.findOne({
      where: { id },
      relations: ['author', 'post']
    });
  }

  async findByPostId(postId) {
    return this.repo.find({
      where: { post: { id: postId } },
      relations: ['author'],
      order: { createdAt: 'ASC' }
    });
  }

  async remove(id) {
    await this.repo.delete(id);
  }
}

module.exports = { commentRepository: CommentRepository.getInstance() };
