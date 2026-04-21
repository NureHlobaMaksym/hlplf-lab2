const express = require('express');
const { authController } = require('./auth.controller');
const { validate } = require('../../common/middleware/validate');
const { asyncHandler } = require('../../common/middleware/async-handler');
const { registerSchema, loginSchema } = require('./auth.validators');
const { authMiddleware } = require('../../common/middleware/auth-middleware');

const authRouter = express.Router();

authRouter.post('/register', validate(registerSchema), asyncHandler(authController.register.bind(authController)));
authRouter.post('/login', validate(loginSchema), asyncHandler(authController.login.bind(authController)));
authRouter.get('/me', authMiddleware, asyncHandler(authController.me.bind(authController)));

module.exports = { authRouter };
