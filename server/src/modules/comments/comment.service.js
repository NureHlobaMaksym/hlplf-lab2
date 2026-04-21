const { commentRepository } = require('./comment.repository');
const { postRepository } = require('../posts/post.repository');
const { userRepository } = require('../users/user.repository');
const { userService } = require('../users/user.service');
const { AppError } = require('../../common/errors/app-error');
const { HTTP_STATUS } = require('../../constants/http-status');
const { MESSAGES } = require('../../constants/messages');

class CommentService {
  static instance;

  static getInstance() {
    if (!CommentService.instance) {
      CommentService.instance = new CommentService();
    }

    return CommentService.instance;
  }

  normalizeComment(comment) {
    return {
      ...comment,
      author: userService.toPublicUser(comment.author)
    };
  }

  async createComment(payload, authorId) {
    const post = await postRepository.findById(Number(payload.postId));
    if (!post) {
      throw new AppError(MESSAGES.POST_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const author = await userRepository.findById(Number(authorId));
    if (!author) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const created = await commentRepository.create({
      content: payload.content.trim(),
      post,
      author
    });

    const comments = await commentRepository.findByPostId(Number(payload.postId));
    const fresh = comments.find((item) => item.id === created.id);
    return this.normalizeComment(fresh || created);
  }

  async getCommentsByPost(postId) {
    const post = await postRepository.findById(Number(postId));
    if (!post) {
      throw new AppError(MESSAGES.POST_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const comments = await commentRepository.findByPostId(Number(postId));
    return comments.map((comment) => this.normalizeComment(comment));
  }

  async deleteComment(commentId, userId) {
    const comment = await commentRepository.findById(Number(commentId));

    if (!comment) {
      throw new AppError(MESSAGES.COMMENT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (comment.author.id !== Number(userId)) {
      throw new AppError(MESSAGES.ACCESS_DENIED, HTTP_STATUS.FORBIDDEN);
    }

    await commentRepository.remove(Number(commentId));
  }
}

module.exports = { commentService: CommentService.getInstance() };
