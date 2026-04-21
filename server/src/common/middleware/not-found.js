const { HTTP_STATUS } = require('../../constants/http-status');

const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
};

module.exports = { notFoundHandler };
