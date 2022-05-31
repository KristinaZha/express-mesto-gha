const express = require('express');

const mongoose = require('mongoose');
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

const { PORT = 3000 } = process.env;
app.use(express.json());

// роуты пользователей
app.use((req, res, next) => {
  req.user = {
    _id: '6295d3520a90203efaa3f413',
  };
  next();
});
app.use('/users', userRouter);

// роуты карточек
app.use('/cards', cardRouter);

app.listen(PORT, () => {
  console.log('Ok!');
});