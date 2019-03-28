'use strict';
const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const helpers = require('./test-helpers');

describe('Income Endpoint', function() {
  let db;
  const { testIncome, testUsers } = helpers.makeFixtures();
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

  describe('POST /income', () => {
    beforeEach('insert income', () => 
      helpers.seedTables(
        db,
        testUsers,
        testIncome
      ));
    it('creates a new income, responding with 201 and the income', function() {
      this.retries(3);
      const testUser = testUsers[0];
      const newIncome = {
        user_id: testUser.id,
        bank_balance: 122.00,
        income: 1202.00,
        add_savings: 112.00
      };
      return supertest(app)
        .post('/income')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newIncome)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id');
          expect(parseInt(res.body.bank_balance)).to.eql(newIncome.bank_balance);
          expect(parseInt(res.body.income)).to.eql(newIncome.income);
          expect(parseInt(res.body.add_savings)).to.eql(newIncome.add_savings);
          expect(res.body.user_id).to.eql(testUser.id);
        })
        .expect(res =>
          db
            .from('spndr_income')
            .select('*')
            .where({id: res.body.id})
            .first()
            .then(row => {
              expect(parseInt(row.bank_balance)).to.eql(newIncome.bank_balance);
              expect(parseInt(row.income)).to.eql(newIncome.income);
              expect(parseInt(row.add_savings)).to.eql(newIncome.add_savings);
              expect(row.user_id).to.eql(newIncome.user_id);
            })
        );
    });
  });
});