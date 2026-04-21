const express = require('express');
const { authRouter } = require('../modules/auth/auth.routes');
const { userRouter } = require('../modules/users/user.routes');
const { postRouter } = require('../modules/posts/post.routes');
const { commentRouter } = require('../modules/comments/comment.routes');
const { friendshipRouter } = require('../modules/friendships/friendship.routes');
const { messageRouter } = require('../modules/messages/message.routes');
const { authMiddleware } = require('../common/middleware/auth-middleware');
const { HTTP_STATUS } = require('../constants/http-status');
const { MESSAGES } = require('../constants/messages');

const apiRouter = express.Router();

apiRouter.get('/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.HEALTH_OK,
    timestamp: new Date().toISOString()
  });
});

apiRouter.use('/auth', authRouter);
apiRouter.use(authMiddleware);
apiRouter.use('/users', userRouter);
apiRouter.use('/posts', postRouter);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/friendships', friendshipRouter);
apiRouter.use('/messages', messageRouter);

module.exports = { apiRouter };
