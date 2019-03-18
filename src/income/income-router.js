'use strict';

const express = require('express');
const path = require('path');
const incomeService = require('./income-service');
const { requireAuth } = require('../middleware/jwt-auth');

const incomeRouter = express.Router();
const jsonBodyParser = express.json();

incomeRouter.route('/:expenses_id').get((req, res, next) => {
  const { expenses_id } = req.params;
  incomeService
    .getById(req.app.get('db'), expenses_id)
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

module.exports = incomeRouter;
