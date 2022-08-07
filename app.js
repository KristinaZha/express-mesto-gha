const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');
const { ERROR_CODE_404 } = require('./errors/errors');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

const regEx = /(?:(http|https):\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+/;

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

const { PORT = 3000 } = process.env;

app.use(express.json());

// логин
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// регистрация
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regEx),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

// ставим защиту авторизацией
app.use(auth);

// роуты пользователей

app.use('/users', userRouter);

// роуты карточек
app.use('/cards', cardRouter);

// обработчик несуществующих роутов
app.use((_, res) => {
  res.status(ERROR_CODE_404).send({ message: 'Страница по указанному маршруту не найдена' });
});

app.listen(PORT, () => {
  console.log('Ok!');
});
