const sendFriendRequestSchema = (req) => {
  const errors = [];
  const { friendId } = req.body;

  if (!friendId || Number.isNaN(Number(friendId))) {
    errors.push('friendId must be a number');
  }

  return errors;
};

module.exports = { sendFriendRequestSchema };
