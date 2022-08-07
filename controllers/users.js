/* eslint-disable object-curly-newline */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

const {
  ERROR_CODE_400,
  ERROR_CODE_404,
  ERROR_CODE_500,
} = require('../errors/errors');

// обновление профиля
const updateProfile = (req, res) => {
  const { name, about } = req.body;
  user
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
    // eslint-disable-next-line consistent-return
    .then((changeUser) => {
      if (!changeUser) {
        return res.status(ERROR_CODE_400).send('Переданы некорректные данные');
      }
      res.send({ message: 'Информация успешно обновлена' });
    })
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'Серверная ошибка' }));
};

// обновление аватара
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  user
    .findByIdAndUpdate(req.user._id, { avatar })
    // eslint-disable-next-line consistent-return
    .then(() => {
      if (!avatar) {
        return res.status(ERROR_CODE_400).send('Переданы некорректные данные');
      }
      res.send({ message: 'Аватар успешно обновлен' });
    })
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'Серверная ошибка' }),
    );
};

// получение одного пользователя
const getUser = (req, res) => {
  user
    .findById(req.params.id)
    // eslint-disable-next-line no-shadow
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_CODE_404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res
          .status(ERROR_CODE_400)
          .send({ message: 'Запрашиваемый id некоректен' });
      }
      return res.status(ERROR_CODE_500).send({ message: 'Серверная ошибка' });
    });
};
// получение информвции о пользователе
const getCurrentUser = (req, res, next) => {
  user
    .findById(req.user._id)
    .then((userMe) => {
      res.send({ data: userMe });
    })
    .catch((err) => {
      next(err);
    });
};
// создание нового пользователя
// eslint-disable-next-line consistent-return
const createUser = (req, res) => {
  const { name, about, avatar, email } = req.body;

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      user.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      });
    })
    .then(() => {
      res.status(201).send({ message: 'Ok' });
    })
    .catch(() =>
      // eslint-disable-next-line implicit-arrow-linebreak
      res.status(ERROR_CODE_500).send({ message: 'Серверная ошибка' })
    );
};

// получение всех пользователей
const getUsers = (_, res) => {
  user
    .find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      res.status(ERROR_CODE_500).send({ message: 'Серверная ошибка' });
    });
};
// логин пользователя
const login = (req, res) => {
  const { email, password } = req.body;
  return user
    .findUserByCredentials(email, password)
    .then((userAuth) => {
      const token = jwt.sign({ id: userAuth._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res
        .cookie('jwt', token, {
          maxAge: 100,
          httpOnly: true,
        })
        .send({ data: token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports = {
  updateUserAvatar,
  updateProfile,
  getUser,
  getUsers,
  createUser,
  login,
  getCurrentUser,
};
