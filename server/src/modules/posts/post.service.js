const { postRepository } = require('./post.repository');
const { userRepository } = require('../users/user.repository');
const { userService } = require('../users/user.service');
const { friendshipService } = require('../friendships/friendship.service');
const { AppError } = require('../../common/errors/app-error');
const { HTTP_STATUS } = require('../../constants/http-status');
const { MESSAGES } = require('../../constants/messages');
const { POST_VISIBILITY } = require('../../constants/social');

class PostService {
  static instance;

  static getInstance() {
    if (!PostService.instance) {
      PostService.instance = new PostService();
    }

    return PostService.instance;
  }

  normalizePost(post) {
    return {
      ...post,
      author: userService.toPublicUser(post.author),
      comments: (post.comments || []).map((comment) => ({
        ...comment,
        author: userService.toPublicUser(comment.author)
      }))
    };
  }

  async canViewPost(post, viewerId) {
    if (post.visibility === POST_VISIBILITY.PUBLIC) {
      return true;
    }

    if (post.author.id === Number(viewerId)) {
      return true;
    }

    return friendshipService.areFriends(post.author.id, viewerId);
  }

  async createPost(payload, authorId) {
    const author = await userRepository.findById(Number(authorId));

    if (!author) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const tags = payload.tags
      ? payload.tags
          .split(',')
          .map((item) => item.trim().toLowerCase())
          .filter(Boolean)
          .slice(0, 10)
      : [];

    const visibility = payload.visibility === POST_VISIBILITY.FRIENDS ? POST_VISIBILITY.FRIENDS : POST_VISIBILITY.PUBLIC;

    const created = await postRepository.create({
      title: payload.title.trim(),
      content: payload.content.trim(),
      visibility,
      tags,
      author
    });

    const withRelations = await postRepository.findById(created.id);
    return this.normalizePost(withRelations);
  }

  async getPosts(currentUserId, query = '') {
    const posts = await postRepository.findAll();
    const filteredByQuery = query
      ? posts.filter((post) => {
          const q = query.toLowerCase();
          return post.title.toLowerCase().includes(q) || post.content.toLowerCase().includes(q);
        })
      : posts;

    const visiblePosts = [];

    for (const post of filteredByQuery) {
      const canView = await this.canViewPost(post, currentUserId);
      if (canView) {
        visiblePosts.push(this.normalizePost(post));
      }
    }

    return visiblePosts;
  }

  async getPostById(id, currentUserId) {
    const post = await postRepository.findById(id);

    if (!post) {
      throw new AppError(MESSAGES.POST_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const canView = await this.canViewPost(post, currentUserId);
    if (!canView) {
      throw new AppError(MESSAGES.ACCESS_DENIED, HTTP_STATUS.FORBIDDEN);
    }

    return this.normalizePost(post);
  }

  async getPostsByAuthor(authorId, viewerId) {
    const posts = await postRepository.findAll();
    const authorPosts = posts.filter((post) => post.author.id === Number(authorId));

    const result = [];
    for (const post of authorPosts) {
      if (await this.canViewPost(post, viewerId)) {
        result.push(this.normalizePost(post));
      }
    }

    return result;
  }

  async deletePost(id, userId) {
    const post = await postRepository.findById(id);

    if (!post) {
      throw new AppError(MESSAGES.POST_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (post.author.id !== Number(userId)) {
      throw new AppError(MESSAGES.ACCESS_DENIED, HTTP_STATUS.FORBIDDEN);
    }

    await postRepository.remove(id);
  }

  async updatePost(id, payload, userId) {
    const post = await postRepository.findById(Number(id));

    if (!post) {
      throw new AppError(MESSAGES.POST_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (post.author.id !== Number(userId)) {
      throw new AppError(MESSAGES.ACCESS_DENIED, HTTP_STATUS.FORBIDDEN);
    }

    const tags = payload.tags
      ? payload.tags
          .split(',')
          .map((item) => item.trim().toLowerCase())
          .filter(Boolean)
          .slice(0, 10)
      : [];

    post.title = payload.title.trim();
    post.content = payload.content.trim();
    post.visibility = payload.visibility === POST_VISIBILITY.FRIENDS ? POST_VISIBILITY.FRIENDS : POST_VISIBILITY.PUBLIC;
    post.tags = tags;

    const saved = await postRepository.save(post);
    const withRelations = await postRepository.findById(saved.id);
    return this.normalizePost(withRelations);
  }
}

module.exports = { postService: PostService.getInstance() };
