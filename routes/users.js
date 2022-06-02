const router = require('express').Router();

const {
  getUser,
  getUsers,
  createUser,
  updateProfile,
  updateUserAvatar,
} = require('../controllers/users');

// update profile
router.patch('/me', updateProfile);

// update avatar
router.patch('/me/avatar', updateUserAvatar);

// get user id
router.get('/:id', getUser);

// get users
router.get('/', getUsers);

// create new user
router.post('/', createUser);

module.exports.userRouter = router;
