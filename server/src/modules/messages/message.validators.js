const createMessageSchema = (req) => {
  const errors = [];
  const { receiverId, content } = req.body;

  if (!receiverId || Number.isNaN(Number(receiverId))) {
    errors.push('receiverId must be a number');
  }

  if (!content || content.trim().length < 1 || content.trim().length > 1000) {
    errors.push('content must be 1-1000 characters');
  }

  return errors;
};

module.exports = { createMessageSchema };
