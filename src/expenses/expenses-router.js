'use strict';

const express = require('express');
const path = require('path');
const expenseService = require('./expenses-service');
const { requireAuth } = require('../middleware/jwt-auth');

const expenseRouter = express.Router();
const jsonBodyParser = express.json();

expenseRouter
  .route('/')
  .all(requireAuth)
  .post(jsonBodyParser, (req, res, next) => {
    const { name, amount } = req.body;
    const newExpense = { name, amount };

    for (const [key, value] of Object.entries(newExpense))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });
    newExpense.user_id = req.user.id;

    expenseService
      .insertExpense(req.app.get('db'), newExpense)
      .then(expense => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${expense.id}`))
          .json(expenseService.serializeExpense(expense));
      })
      .catch(next);
  });

expenseRouter
  .route('/').get((req, res, next) => {
    expenseService.getById(req.app.get('db'), req.user.id).then(exp => {
      if (!exp) {
        return res.status(404).json({
          error: { message: 'Expenses not found' }
        });
      }
      res.status(200).json(exp);
      next();
    })
      .catch(next);
  });

module.exports = expenseRouter;
