'use strict';

const express = require('express');
const path = require('path');
const WishlistService = require('./wishlist-service');
const { requireAuth } = require('../middleware/jwt-auth');

const wishlistRouter = express.Router();
const jsonBodyParser = express.json();

wishlistRouter
  .route('/')
  .all(requireAuth)
  .post(jsonBodyParser, (req, res, next) => {
    const { name, url, price } = req.body;
    const newWishlistEntry = { name, url, price };

    for (const [key, value] of Object.entries(newWishlistEntry))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });
    newWishlistEntry.user_id = req.user.id;

    WishlistService.insertWish(req.app.get('db'), newWishlistEntry)
      .then(wishlist => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${wishlist.id}`))
          .json(WishlistService.serializeWish(wishlist));
      })
      .catch(next);
  });

wishlistRouter.route('/').get((req, res, next) => {
  WishlistService.getById(req.app.get('db'), req.user.id)
    .then(wish => {
      if (!wish) {
        return res.status(404).json({
          error: { message: 'Wishlist not found' }
        });
      }
      res.status(200).json(wish);
      next();
    })
    .catch(next);
});

wishlistRouter
  .route('/:item_id')
  .delete((req, res, next) => {
    WishlistService
      .deleteWish(req.app.get('db'), req.params.item_id)
      .then(wish => {
        if (!wish) {
          return res.status(404).json({ error: {message: 'item not found'}
          });
        }
        res.status(204).end();
        next();
      })
      .catch(next);
  });

module.exports = wishlistRouter;
