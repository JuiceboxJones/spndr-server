'use strict';


const incomeService = {
  getById(db, id) {
    return db
      .from('spndr_income')
      .select('*')
      .where('user_id', id);
  },
  insertIncome(db, newIncome) {
    return db
      .insert(newIncome)
      .into('spndr_income')
      .returning('*')
      .then(([income]) => income);
  },
  deleteIncome(db, id){
    return db('spndr_income')
      .where({ id })
      .delete();
  }
};

module.exports = incomeService;