const express = require('express');
const { commentController } = require('./comment.controller');
const { asyncHandler } = require('../../common/middleware/async-handler');
const { validate } = require('../../common/middleware/validate');
const { createCommentSchema } = require('./comment.validators');

const commentRouter = express.Router();

commentRouter.get('/post/:postId', asyncHandler(commentController.getByPost.bind(commentController)));
commentRouter.post('/', validate(createCommentSchema), asyncHandler(commentController.create.bind(commentController)));
commentRouter.delete('/:id', asyncHandler(commentController.delete.bind(commentController)));

module.exports = { commentRouter };
