const xss = require('xss')

const WishlistService = {
  getById(db, id) {
    return db
      .from('spndr_wishlist AS wish')
      .select(
        'wish.id',
        'wish.name',
        'wish.url',
        'wish.date_created',
        'wish.user_id',
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
        'wish.user_id',
        'usr.id',
      )
      .where('rev.id', id)
      .first()
  },

  insertWish(db, newWish) {
    return db
      .insert(newWish)
      .into('spndr_wishlist')
      .returning('*')
      .then(([wish]) => wish)
      .then(wish =>
        WishlistService.getById(db, wish.id)
      )
  },

  serializeWish(wishlist) {
    return {
      id: wishlist.id,
      name: xss(wishlist.name),
      url: xss(wishlist.url),
      user_id: wishlist.user_id,
      date_created: wishlist.date_created,
      user: wishlist.user || {},
    }
  }
}

module.exports = WishlistService