const express = require('express');
const { friendshipController } = require('./friendship.controller');
const { asyncHandler } = require('../../common/middleware/async-handler');
const { validate } = require('../../common/middleware/validate');
const { sendFriendRequestSchema } = require('./friendship.validators');

const friendshipRouter = express.Router();

friendshipRouter.get('/requests/incoming', asyncHandler(friendshipController.incoming.bind(friendshipController)));
friendshipRouter.get('/requests/outgoing', asyncHandler(friendshipController.outgoing.bind(friendshipController)));
friendshipRouter.get('/friends', asyncHandler(friendshipController.friends.bind(friendshipController)));
friendshipRouter.delete('/friends/:friendId', asyncHandler(friendshipController.removeFriend.bind(friendshipController)));
friendshipRouter.post('/requests', validate(sendFriendRequestSchema), asyncHandler(friendshipController.sendRequest.bind(friendshipController)));
friendshipRouter.post('/requests/:requestId/accept', asyncHandler(friendshipController.accept.bind(friendshipController)));
friendshipRouter.post('/requests/:requestId/reject', asyncHandler(friendshipController.reject.bind(friendshipController)));

module.exports = { friendshipRouter };
