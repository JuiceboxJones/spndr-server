'use strict';

const xss = require('xss')

const expenseService = {
  getById(db, id) {
    return db
      .from('spndr_expenses')
      .select('*')
      .where('user_id', id);
  },

  insertReview(db, newExpense) {
    return db
      .insert(newExpense)
      .into('spndr_expenses')
      .returning('*')
      .then(([expense]) => expense)
      .then(expense =>
        expensesService.getById(db, expense.id)
      );
  },

  serializeExpense(expense) {
    return {
      id: expense.id,
      amount: expense.amount,
      name: xss(expense.name),
      user_id: expense.user_id,
      date_created: expense.date_created,
      user: expense.user || {},
    }
  }
}

module.exports = expenseService;