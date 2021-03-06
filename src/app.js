'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const expenseRouter = require('./expenses/expenses-router');
const wishlistRouter = require('./wishlist/wishlist-router');
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/user-router');
const incomeRouter = require('./income/income-router');
const {CLIENT_ORIGIN} = require('./config');

const app = express();

app.use(
  morgan(NODE_ENV === 'production' ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test'
  })
);
app.use(cors());
app.use(helmet());

app.use('/expenses', expenseRouter);
app.use('/wishlist', wishlistRouter);
app.use('/income', incomeRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);


app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: 'Server error' };
  } else {
    console.error(error);
    response = { error: error.message, object: error };
  }
  res.status(500).json(response);
});

module.exports = app;