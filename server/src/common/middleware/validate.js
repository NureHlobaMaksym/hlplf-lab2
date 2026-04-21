const { AppError } = require('../errors/app-error');
const { HTTP_STATUS } = require('../../constants/http-status');
const { MESSAGES } = require('../../constants/messages');

const validate = (schema) => (req, res, next) => {
  const errors = schema(req);

  if (errors.length > 0) {
    return next(new AppError(`${MESSAGES.VALIDATION_FAILED}: ${errors.join(', ')}`, HTTP_STATUS.BAD_REQUEST));
  }

  next();
};

module.exports = { validate };
