'use strict';


const incomeService = {
  getById(db, id) {
    return db
      .from('spndr_income')
      .select('*')
      .where('expenses_id', id);
  },
  insertIncome(db, newIncome) {
    return db
      .insert(newIncome)
      .into('spndr_income')
      .returning('*')
      .then(([income]) => income);
  },
};

module.exports = incomeService;