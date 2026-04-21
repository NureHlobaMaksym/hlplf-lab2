const express = require('express');
const { postController } = require('./post.controller');
const { asyncHandler } = require('../../common/middleware/async-handler');
const { validate } = require('../../common/middleware/validate');
const { createPostSchema, updatePostSchema } = require('./post.validators');

const postRouter = express.Router();

postRouter.get('/', asyncHandler(postController.getAll.bind(postController)));
postRouter.get('/:id', asyncHandler(postController.getById.bind(postController)));
postRouter.post('/', validate(createPostSchema), asyncHandler(postController.create.bind(postController)));
postRouter.patch('/:id', validate(updatePostSchema), asyncHandler(postController.update.bind(postController)));
postRouter.delete('/:id', asyncHandler(postController.delete.bind(postController)));

module.exports = { postRouter };
