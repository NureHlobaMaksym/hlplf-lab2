const { commentService } = require('./comment.service');
const { HTTP_STATUS } = require('../../constants/http-status');

class CommentController {
  static instance;

  static getInstance() {
    if (!CommentController.instance) {
      CommentController.instance = new CommentController();
    }

    return CommentController.instance;
  }

  async create(req, res) {
    const result = await commentService.createComment(req.body, req.user.id);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: result });
  }

  async getByPost(req, res) {
    const result = await commentService.getCommentsByPost(req.params.postId);
    res.status(HTTP_STATUS.OK).json({ success: true, data: result });
  }

  async delete(req, res) {
    await commentService.deleteComment(Number(req.params.id), req.user.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

module.exports = { commentController: CommentController.getInstance() };
