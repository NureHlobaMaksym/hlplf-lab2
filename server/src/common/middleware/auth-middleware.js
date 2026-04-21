const { authService } = require('../../modules/auth/auth.service');
const { AppError } = require('../errors/app-error');
const { HTTP_STATUS } = require('../../constants/http-status');
const { MESSAGES } = require('../../constants/messages');

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return next(new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED));
  }

  const payload = authService.verifyToken(token);
  req.user = { id: payload.userId };
  next();
};

module.exports = { authMiddleware };
