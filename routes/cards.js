const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  deleteCard,
  getCards,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const regEx = /(?:(http|https):\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+/;

// delete card
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardID: Joi.string().length(24).hex().required(),
  }),
}), deleteCard);

// get cards

router.get('/', getCards);

// create new card
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regEx),
  }),
}), createCard);

// put like
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardID: Joi.string().length(24).hex().required(),
  }),
}), likeCard);

// delete like
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardID: Joi.string().length(24).hex().required(),
  }),
}), dislikeCard);

module.exports.cardRouter = router;
