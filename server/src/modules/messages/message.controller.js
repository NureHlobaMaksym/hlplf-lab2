const { messageService } = require('./message.service');
const { HTTP_STATUS } = require('../../constants/http-status');
const { emitToUsers } = require('../../socket/socket-emitter');

class MessageController {
  static instance;

  static getInstance() {
    if (!MessageController.instance) {
      MessageController.instance = new MessageController();
    }

    return MessageController.instance;
  }

  async create(req, res) {
    const receiverId = Number(req.body.receiverId);

    const result = await messageService.sendMessage({
      senderId: req.user.id,
      receiverId,
      content: req.body.content
    });

    emitToUsers([req.user.id, receiverId], 'new_message', result);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: result });
  }

  async getConversation(req, res) {
    const result = await messageService.getConversation(req.user.id, Number(req.params.peerUserId));
    res.status(HTTP_STATUS.OK).json({ success: true, data: result });
  }

  async markRead(req, res) {
    await messageService.markConversationRead(req.user.id, Number(req.params.peerUserId));
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }

  async getChats(req, res) {
    const result = await messageService.getChats(req.user.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: result });
  }

  async deleteConversation(req, res) {
    const peerUserId = Number(req.params.peerUserId);
    await messageService.deleteConversation(req.user.id, peerUserId);
    emitToUsers([req.user.id, peerUserId], 'chat_deleted', { userAId: Number(req.user.id), userBId: peerUserId });
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

module.exports = { messageController: MessageController.getInstance() };
