const express = require('express');
const { userController } = require('./user.controller');
const { asyncHandler } = require('../../common/middleware/async-handler');
const { validate } = require('../../common/middleware/validate');
const { updatePrivacySchema } = require('./user.validators');

const userRouter = express.Router();

userRouter.get('/search', asyncHandler(userController.search.bind(userController)));
userRouter.get('/:id/profile', asyncHandler(userController.getProfile.bind(userController)));
userRouter.get('/:id', asyncHandler(userController.getById.bind(userController)));
userRouter.patch('/me/privacy', validate(updatePrivacySchema), asyncHandler(userController.updatePrivacy.bind(userController)));

module.exports = { userRouter };
