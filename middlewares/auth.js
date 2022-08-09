const jwt = require('jsonwebtoken');
const Error401 = require('../errors/Error401');

module.exports = (req, _, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Error401('Пройдите авторизацию');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
    req.user = payload;
  } catch (err) {
    return next(new Error401('Пройдите авторизацию'));
  } return next();
};
