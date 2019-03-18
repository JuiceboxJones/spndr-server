const xss = require('xss')

const expenseService = {
  getById(db, id) {
    return db
      .from('spndr_expenses AS exp')
      .select(
        'exp.id',
        'exp.amount',
        'exp.name',
        'exp.date_created',
        'exp.user_id',
        db.raw(
          `row_to_json(
            (SELECT tmp FROM (
              SELECT
                usr.id,
                usr.user_name,
                usr.full_name,
                usr.date_created,
                usr.date_modified
            ) tmp)
          ) AS "user"`
        )
      )
      .leftJoin(
        'spndr_users AS usr',
        'exp.user_id',
        'usr.id',
      )
      .where('exp.id', id)
      .first()
  },

  insertReview(db, newExpense) {
    return db
      .insert(newExpense)
      .into('spndr_expenses')
      .returning('*')
      .then(([expense]) => expense)
      .then(expense =>
        expensesService.getById(db, expense.id)
      )
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

module.exports = expenseService