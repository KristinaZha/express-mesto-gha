const user = require('../models/user');

const {
  ERROR_CODE_400,
  ERROR_CODE_404,
  ERROR_CODE_500,
} = require('../utils/errors');

// обновление профиля
const updateProfile = (req, res) => {
  const { name, about } = req.body;
  user.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((changeUser)
     => {
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
  user.findByIdAndUpdate(req.user._id, { avatar })
    .then(() => {
      if (!avatar) {
        return res.status(ERROR_CODE_400).send('Переданы некорректные данные');
      }
      res.send({ message: 'Аватар успешно обновлен' });
    })
    .catch(() => res.status(500).send({ message: 'Серверная ошибка' }));
};

// получение одного пользователя
const getUser = (req, res) => {
  const id = req.params.id;
  user.findById(id)
    .then(user => {
      if (!user) {
        res.status(ERROR_CODE_404).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(ERROR_CODE_400).send({ message: 'Запрашиваемый id некоректен' });
      }
      return res.status(500).send({ message: 'Серверная ошибка' });
    });
};

// создание нового пользователя
const createUser = (req, res) => {
const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
  }

  user.create({ name, about, avatar })
    .then(user => {
      res.status(201).send(user);
    })
    .catch(() => res.status(500).send({ message: 'Серверная ошибка' }));
};

// получение всех пользователей
const getUsers = (_, res) => {
  user.find({})
    .then(users => {
      res.status(200).send(users);
    })
    .catch(() => {
      res.status(500).send({ message: 'Серверная ошибка' });
    });
};

module.exports = {
  updateUserAvatar,
  updateProfile,
  getUser,
  getUsers,
  createUser,
};