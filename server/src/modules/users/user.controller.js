const { userService } = require('./user.service');
const { postService } = require('../posts/post.service');
const { HTTP_STATUS } = require('../../constants/http-status');

class UserController {
  static instance;

  static getInstance() {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }

    return UserController.instance;
  }

  async search(req, res) {
    const result = await userService.searchUsers((req.query.q || '').trim(), req.user.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: result });
  }

  async getById(req, res) {
    const result = await userService.getUserById(Number(req.params.id), req.user.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: result });
  }

  async getProfile(req, res) {
    const user = await userService.getUserById(Number(req.params.id), req.user.id);
    const posts = await postService.getPostsByAuthor(Number(req.params.id), req.user.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: { user, posts } });
  }

  async updatePrivacy(req, res) {
    const result = await userService.updatePrivacy(req.user.id, req.body.allowMessagesFrom);
    res.status(HTTP_STATUS.OK).json({ success: true, data: result });
  }
}

module.exports = { userController: UserController.getInstance() };
