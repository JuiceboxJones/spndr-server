'use strict';

const xss = require('xss')

const incomeService = {
  getById(db, id) {
    return db
      .from('spndr_income')
      .select('*')
      .where('expenses_id', id);
  },
  serializeIncome(income) {
    return {
      id: income.id,
      bank_balance: income.bank_balance,
      income: income.income,
      expenses_id: income.expenses_id,
      date_created: income.date_created,
      savings: income.add_savings || {},
    }
  }
}

module.exports = incomeService;