const { POST_VISIBILITY } = require('../../constants/social');

const createPostSchema = (req) => {
  const errors = [];
  const { title, content, visibility } = req.body;

  if (!title || title.trim().length < 3 || title.trim().length > 160) {
    errors.push('title must be 3-160 characters');
  }

  if (!content || content.trim().length < 10 || content.trim().length > 2000) {
    errors.push('content must be 10-2000 characters');
  }

  if (req.body.tags && req.body.tags.length > 120) {
    errors.push('tags length must be <= 120 characters');
  }

  if (visibility && !Object.values(POST_VISIBILITY).includes(visibility)) {
    errors.push('visibility must be public or friends');
  }

  return errors;
};

const updatePostSchema = createPostSchema;

module.exports = { createPostSchema, updatePostSchema };
