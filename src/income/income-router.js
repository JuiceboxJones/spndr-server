'use strict';

const express = require('express');
const path = require('path');
const incomeService = require('./income-service');
const { requireAuth } = require('../middleware/jwt-auth');

const incomeRouter = express.Router();
const jsonBodyParser = express.json();

incomeRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    incomeService
      .getById(req.app.get('db'), req.user.id)
      .then(income => {
        if (!income) {
          return res.status(404).json({
            error: { message: 'Income not found' }
          });
        }
        res.status(200).json(income);
        next();
      })
      .catch(next);
  });

incomeRouter
  .route('/')
  .post(jsonBodyParser, (req, res, next) => {
    const { bank_balance, income, add_savings } = req.body;
    const newIncome = { bank_balance, income, add_savings };
    
    for (const [key, value] of Object.entries(newIncome))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });
    newIncome.expenses_id = req.user.id;

    incomeService
      .insertIncome(req.app.get('db'), newIncome)
      .then(income => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${income.id}`))
          .json(income);
      })
      .catch(next);
  });

incomeRouter
  .route('/:income_id')
  .delete((req, res, next) => {
    incomeService
      .deleteIncome(req.app.get('db'), req.params.income_id)
      .then(inc => {
        if (!inc) {
          return res.status(404).json({ error: {message: 'income not found'}
          });
        }
        res.status(204).end();
        next();
      })
      .catch(next);
  });

module.exports = incomeRouter;
