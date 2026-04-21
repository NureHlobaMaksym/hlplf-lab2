const { authService } = require('./auth.service');
const { HTTP_STATUS } = require('../../constants/http-status');

class AuthController {
  static instance;

  static getInstance() {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }

    return AuthController.instance;
  }

  async register(req, res) {
    const result = await authService.register(req.body);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: result });
  }

  async login(req, res) {
    const result = await authService.login(req.body);
    res.status(HTTP_STATUS.OK).json({ success: true, data: result });
  }

  async me(req, res) {
    const result = await authService.me(req.user.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: result });
  }
}

module.exports = { authController: AuthController.getInstance() };
