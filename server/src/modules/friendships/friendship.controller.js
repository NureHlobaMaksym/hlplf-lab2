const { friendshipService } = require('./friendship.service');
const { HTTP_STATUS } = require('../../constants/http-status');
const { emitToUsers } = require('../../socket/socket-emitter');

class FriendshipController {
  static instance;

  static getInstance() {
    if (!FriendshipController.instance) {
      FriendshipController.instance = new FriendshipController();
    }

    return FriendshipController.instance;
  }

  async sendRequest(req, res) {
    const result = await friendshipService.sendRequest(req.user.id, Number(req.body.friendId));
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: result });
  }

  async incoming(req, res) {
    const result = await friendshipService.getIncoming(req.user.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: result });
  }

  async outgoing(req, res) {
    const result = await friendshipService.getOutgoing(req.user.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: result });
  }

  async accept(req, res) {
    const result = await friendshipService.acceptRequest(req.user.id, Number(req.params.requestId));
    res.status(HTTP_STATUS.OK).json({ success: true, data: result });
  }

  async reject(req, res) {
    const result = await friendshipService.rejectRequest(req.user.id, Number(req.params.requestId));
    res.status(HTTP_STATUS.OK).json({ success: true, data: result });
  }

  async friends(req, res) {
    const result = await friendshipService.getFriends(req.user.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: result });
  }

  async removeFriend(req, res) {
    const friendId = Number(req.params.friendId);
    await friendshipService.removeFriend(req.user.id, friendId);
    emitToUsers([req.user.id, friendId], 'chat_deleted', { userAId: Number(req.user.id), userBId: friendId });
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

module.exports = { friendshipController: FriendshipController.getInstance() };
