const express = require('express');
const mongoose = require('mongoose');
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');
const { ERROR_CODE_404 } = require('./utils/errors');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

const { PORT = 3000 } = process.env;
app.use(express.json());

// роуты пользователей
app.use((req, _, next) => {
  req.user = {
    _id: '6295d3520a90203efaa3f413',
  };
  next();
});
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
