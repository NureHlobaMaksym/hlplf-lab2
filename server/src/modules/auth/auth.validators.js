const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const registerSchema = (req) => {
  const errors = [];
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || firstName.trim().length < 2 || firstName.trim().length > 80) {
    errors.push('firstName must be 2-80 characters');
  }

  if (!lastName || lastName.trim().length < 2 || lastName.trim().length > 80) {
    errors.push('lastName must be 2-80 characters');
  }

  if (!email || !emailRegex.test(email.trim())) {
    errors.push('email must be valid');
  }

  if (!password || password.length < 8 || password.length > 64) {
    errors.push('password must be 8-64 characters');
  }

  return errors;
};

const loginSchema = (req) => {
  const errors = [];
  const { email, password } = req.body;

  if (!email || !emailRegex.test(email.trim())) {
    errors.push('email must be valid');
  }

  if (!password || password.length < 8 || password.length > 64) {
    errors.push('password must be 8-64 characters');
  }

  return errors;
};

module.exports = { registerSchema, loginSchema };
