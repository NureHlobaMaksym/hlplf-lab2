const { postService } = require('./post.service');
const { HTTP_STATUS } = require('../../constants/http-status');

class PostController {
  static instance;

  static getInstance() {
    if (!PostController.instance) {
      PostController.instance = new PostController();
    }

    return PostController.instance;
  }

  async create(req, res) {
    const result = await postService.createPost(req.body, req.user.id);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: result });
  }

  async getAll(req, res) {
    const result = await postService.getPosts(req.user.id, (req.query.q || '').trim());
    res.status(HTTP_STATUS.OK).json({ success: true, data: result });
  }

  async getById(req, res) {
    const result = await postService.getPostById(Number(req.params.id), req.user.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: result });
  }

  async delete(req, res) {
    await postService.deletePost(Number(req.params.id), req.user.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }

  async update(req, res) {
    const result = await postService.updatePost(Number(req.params.id), req.body, req.user.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: result });
  }
}

module.exports = { postController: PostController.getInstance() };
