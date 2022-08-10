const card = require('../models/card');
const Error400 = require('../errors/Error400');
const Error404 = require('../errors/Error404');
const Error403 = require('../errors/Error403');

// возвращает все карточки
const getCards = (_, res, next) => {
  card
    .find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((next));
};

// создаёт карточку

const createCard = (req, res, next) => {
  const { name, link, owner = req.user._id } = req.body;
  card.create({ name, link, owner })
    .then((newCard) => {
      res.status(201).send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new Error400('Проверьте правильность введенных данных.'));
      }
      return next(err);
    });
};

// удаляет карточку по идентификатору

const deleteCard = (req, res, next) => {
  const { id } = req.params;
  card
    .findById(id).orFail(() => new Error404('Нет карточки по заданному id'))
    .then((pic) => {
      if (!pic.owner.equals(req.user._id)) {
        return next(new Error403('Попытка удалить чужую карточку'));
      }
      return pic.remove().then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch(next);
};

//  поставить лайк карточке
const likeCard = (req, res, next) => {
  const { id } = req.params;
  card
    .findByIdAndUpdate(
      id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((like) => {
      if (!like) {
        throw new Error404('Картинка не найдена или удалена');
      }
      return res.status(200).send({ message: 'Вы поставили лайк' });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new Error400('Картинка не найдена'));
      }
      return next(err);
    });
};
//  убрать лайк с карточки
const dislikeCard = (req, res, next) => {
  const { id } = req.params;
  card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((like) => {
      if (!like) {
        throw new Error404('Картинка не найдена или удалена ранее');
      }
      return res.status(200).send({ message: 'Вы удалили лайк' });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new Error400('Картинка не найдена'));
      }
      return next(err);
    });
};

module.exports = {
  likeCard,
  dislikeCard,
  deleteCard,
  getCards,
  createCard,
};
