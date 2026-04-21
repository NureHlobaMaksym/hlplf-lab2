const express = require('express');
const { messageController } = require('./message.controller');
const { asyncHandler } = require('../../common/middleware/async-handler');
const { validate } = require('../../common/middleware/validate');
const { createMessageSchema } = require('./message.validators');

const messageRouter = express.Router();

messageRouter.get('/chats', asyncHandler(messageController.getChats.bind(messageController)));
messageRouter.get('/conversation/:peerUserId', asyncHandler(messageController.getConversation.bind(messageController)));
messageRouter.delete('/conversation/:peerUserId', asyncHandler(messageController.deleteConversation.bind(messageController)));
messageRouter.post('/conversation/:peerUserId/read', asyncHandler(messageController.markRead.bind(messageController)));
messageRouter.post('/', validate(createMessageSchema), asyncHandler(messageController.create.bind(messageController)));

module.exports = { messageRouter };
