/* eslint-disable brace-style */
/* eslint-disable semi */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
const card = require('../models/card');

const {
  ERROR_CODE_400,
  ERROR_CODE_404,
  ERROR_CODE_403,
  ERROR_CODE_500,
} = require('../errors/errors');

// возвращает все карточки
const getCards = (_, res) => {
  card
    .find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      res.status(ERROR_CODE_500).send({ message: 'Серверная ошибка' });
    });
};

// создаёт карточку

const createCard = (req, res) => {
  const { name, link, owner = req.user._id } = req.body;
  if (!name || !link || !owner) {
    return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
  }

  card.create({ name, link, owner })
    .then((newCard) => {
      res.status(201).send(newCard);
    })
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'Серверная ошибка' }))
};

// удаляет карточку по идентификатору

const deleteCard = (req, res) => {
  const id = req.params.cardId;
  card
    .findByIdAndRemove(id)
    .then((pic) => {
      if (!pic) {
        res.status(ERROR_CODE_403).send({ message: 'Попытка удалить чужую карточку' });
        return;
      }
      res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res
          .status(ERROR_CODE_400)
          .send({ message: 'Карточка не найдена' });
      }
      return res.status(ERROR_CODE_500).send({ message: 'Серверная ошибка' });
    });
};

//  поставить лайк карточке
const likeCard = (req, res) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((like) => {
      if (!like) {
        return res
          .status(ERROR_CODE_404)
          .send({ message: 'Переданы некорректные данные' });
      }
      res.status(200).send(like);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res
          .status(ERROR_CODE_404)
          .send({ message: 'Запрашиваемый id некоректен' });
      }
      return res.status(ERROR_CODE_500).send({ message: 'Серверная ошибка' });
    });
};

//  убрать лайк с карточки

const dislikeCard = (req, res) => card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
  .then((like) => {
    if (!like) { return res.status(ERROR_CODE_404).send({ message: 'Переданы некорректные данные' }); }
    res.status(200).send(like);
  })
  .catch((err) => {
    if (err.kind === 'ObjectId') {
      return res
        .status(ERROR_CODE_404).send({ message: 'Запрашиваемый id некоректен' });
    }
    return res.status(ERROR_CODE_500).send({ message: 'Серверная ошибка' });
  });

module.exports = {
  likeCard,
  dislikeCard,
  deleteCard,
  getCards,
  createCard,
};
