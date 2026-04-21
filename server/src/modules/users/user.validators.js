const { ALLOW_MESSAGES_FROM } = require('../../constants/social');

const updatePrivacySchema = (req) => {
  const errors = [];
  const { allowMessagesFrom } = req.body;

  if (!Object.values(ALLOW_MESSAGES_FROM).includes(allowMessagesFrom)) {
    errors.push('allowMessagesFrom must be all or friends');
  }

  return errors;
};

module.exports = { updatePrivacySchema };
