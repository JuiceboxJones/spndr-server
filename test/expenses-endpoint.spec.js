'use strict';
const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const helpers = require('./test-helpers');


describe('Expenses Endpoint', function() {
  let db;
  const { testExpenses, testUsers } = helpers.makeFixtures();
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });
  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('POST /expenses', () => {
    beforeEach('insert expenses', () => 
      helpers.seedTables(
        db,
        testUsers,
        [],
        testExpenses
      ));
    it('creates a new expense, responding with 201 and the expense', function() {
      this.retries(3);
      const testUser = testUsers[0];
      const newExpense = {
        user_id: testUser.id,
        name: 'Fruit',
        amount: 12.00
      };
      return supertest(app)
        .post('/expenses')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newExpense)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id');
          expect(res.body.name).to.eql(newExpense.name);
          expect(parseInt(res.body.amount)).to.equal(newExpense.amount);
          expect(res.body.user_id).to.eql(testUser.id);
        })
        .expect(res =>
          db
            .from('spndr_expenses')
            .select('*')
            .where({id: res.body.id})
            .first()
            .then(row => {
              expect(row.name).to.eql(newExpense.name);
              expect(parseInt(row.amount)).to.eql(newExpense.amount);
              expect(row.user_id).to.eql(newExpense.user_id);
            })
        );
    });
  });
});