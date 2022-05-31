const router = require('express').Router();
const { deleteCard, getCards, createCard, likeCard, dislikeCard } = require('../controllers/cards');

// delete card
router.delete('/:cardId', deleteCard);

// get cards

router.get('/', getCards);

// create new card
router.post('/', createCard);

// put like
router.put('/:cardId/likes', likeCard );

// delete like
router.delete('/:cardId/likes', dislikeCard );

module.exports.cardRouter = router;
