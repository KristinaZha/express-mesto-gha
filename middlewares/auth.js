const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res(401).send({ message: 'Пройдите авторизацию' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).send({ message: 'Пройдите авторизацию' });
  }
};