const createCommentSchema = (req) => {
  const errors = [];
  const { postId, content } = req.body;

  if (!postId || Number.isNaN(Number(postId))) {
    errors.push('postId must be a number');
  }

  if (!content || content.trim().length < 1 || content.trim().length > 500) {
    errors.push('content must be 1-500 characters');
  }

  return errors;
};

module.exports = { createCommentSchema };
