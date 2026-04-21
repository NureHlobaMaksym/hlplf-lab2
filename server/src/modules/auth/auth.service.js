const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { env } = require('../../config/env');
const { userRepository } = require('../users/user.repository');
const { userService } = require('../users/user.service');
const { AppError } = require('../../common/errors/app-error');
const { HTTP_STATUS } = require('../../constants/http-status');
const { MESSAGES } = require('../../constants/messages');
const { ALLOW_MESSAGES_FROM } = require('../../constants/social');

class AuthService {
  static instance;

  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }

    return AuthService.instance;
  }

  createToken(userId) {
    return jwt.sign({ userId }, env.auth.jwtSecret, { expiresIn: env.auth.jwtExpiresIn });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, env.auth.jwtSecret);
    } catch {
      throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }
  }

  async register(payload) {
    const email = payload.email.trim().toLowerCase();

    const emailExisting = await userRepository.findByEmail(email);
    if (emailExisting) {
      throw new AppError('User with this email already exists', HTTP_STATUS.CONFLICT);
    }

    const firstName = payload.firstName.trim();
    const lastName = payload.lastName.trim();

    const passwordHash = await bcrypt.hash(payload.password, 10);

    const user = await userRepository.create({
      firstName,
      lastName,
      email,
      passwordHash,
      allowMessagesFrom: ALLOW_MESSAGES_FROM.FRIENDS
    });

    return {
      token: this.createToken(user.id),
      user: userService.toPublicUser(user)
    };
  }

  async login(payload) {
    const user = await userRepository.findByEmail(payload.email.trim().toLowerCase());

    if (!user || !user.passwordHash) {
      throw new AppError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    const isPasswordCorrect = await bcrypt.compare(payload.password, user.passwordHash);

    if (!isPasswordCorrect) {
      throw new AppError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    return {
      token: this.createToken(user.id),
      user: userService.toPublicUser(user)
    };
  }

  async me(userId) {
    return userService.getUserById(Number(userId));
  }
}

module.exports = { authService: AuthService.getInstance() };
