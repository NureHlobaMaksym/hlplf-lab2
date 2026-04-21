const { HTTP_STATUS } = require('../../constants/http-status');
const { MESSAGES } = require('../../constants/messages');

const errorHandler = (error, req, res) => {
  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message: error.message || MESSAGES.UNKNOWN_ERROR
  });
};

module.exports = { errorHandler };
