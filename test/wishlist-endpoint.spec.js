'use strict';
const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const helpers = require('./test-helpers');

describe('Wishlist Endpoint', function() {
  let db;
  const { testWishlist, testUsers } = helpers.makeFixtures();
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

  describe('POST /wishlist', () => {
    beforeEach('insert wishlist', () => 
      helpers.seedTables(
        db,
        testUsers,
        testWishlist
      ));
    it('creates a new wishlist, responding with 201 and the wishlist', function() {
      this.retries(3);
      const testUser = testUsers[0];
      const newWishlistItem = {
        user_id: testUser.id,
        name: 'test', 
        url: 'http://www.test.com',
        price: 100.00
      };
      return supertest(app)
        .post('/wishlist')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newWishlistItem)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id');
          expect(res.body.name).to.eql(newWishlistItem.name);
          expect(res.body.url).to.eql(newWishlistItem.url);
          expect(parseInt(res.body.price)).to.equal(newWishlistItem.price);
          expect(res.body.user_id).to.eql(testUser.id);
        })
        .expect(res =>
          db
            .from('spndr_wishlist')
            .select('*')
            .where({id: res.body.id})
            .first()
            .then(row => {
              expect(row.name).to.eql(newWishlistItem.name);
              expect(row.url).to.eql(newWishlistItem.url);
              expect(parseInt(row.price)).to.eql(newWishlistItem.price);
              expect(row.user_id).to.eql(newWishlistItem.user_id);
            })
        );
    });
  });
});