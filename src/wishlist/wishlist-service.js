'use strict';

const xss = require('xss');

const WishlistService = {
  
  getById(db, id) {
    return db
      .from('spndr_wishlist')
      .select('*')
      .where('user_id', id);
  },

  insertWish(db, newWish) {
    return db
      .insert(newWish)
      .into('spndr_wishlist')
      .returning('*')
      .then(([wish]) => wish)
      .then(wish =>
        WishlistService.getById(db, wish.id)
      );
  },

  serializeWish(wishlist) {
    return {
      id: wishlist.id,
      name: xss(wishlist.name),
      url: xss(wishlist.url),
      user_id: wishlist.user_id,
      date_created: wishlist.date_created,
      price: wishlist.price,
    };
  }
};

module.exports = WishlistService;