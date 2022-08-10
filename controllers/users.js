/* eslint-disable no-shadow */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const Error400 = require('../errors/Error400');
const Error404 = require('../errors/Error404');
const Error409 = require('../errors/Error409');
const Error401 = require('../errors/Error401');

// обновление профиля
const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  user
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
    .then((changeUser) => {
      if (!changeUser) {
        throw new Error404('Пользователь не существует');
      }
      return res.status(200).send(changeUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new Error400('Не соответствует требованию.'));
      }
      if (err.kind === 'ObjectId') {
        return next(new Error400('ID пользователя передано некорретно.'));
      }
      return next(err);
    });
};

// обновление аватара
const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  user
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (!user) {
        throw new Error404('Пользователь не существует');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new Error400('Данные переданы некорретно.'));
      }
      return next(err);
    });
};

// получение одного пользователя
const getUser = (req, res, next) => {
  const { id } = req.params;
  user
    .findById(id)
    .then((user) => {
      if (!user) {
        throw new Error404('Пользователь не существует');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new Error400('Данные переданы некорретно.'));
      }
      return next(err);
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
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => user.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new Error404('Проверьте данные'));
      }
      if (err.code === 11000) {
        return next(new Error409('Пользователь существует'));
      }
      return next(err);
    });
};

// получение всех пользователей
const getUsers = (_, res, next) => {
  user
    .find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

// логин пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;
  return user
    .findUserByCredentials(email, password)
    .then((userAuth) => {
      if (!userAuth) {
        throw new Error400('Пользователь не найден');
      }
      res.send({
        token: jwt.sign({ _id: userAuth._id }, 'some-secret-key', {
          expiresIn: '7d',
        }),
      });
    })
    .catch(() => {
      next(new Error401('Данные неверны'));
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
