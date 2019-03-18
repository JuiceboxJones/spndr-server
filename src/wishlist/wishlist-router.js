'use strict';

const express = require('express');
const path = require('path');
const WishlistService = require('./wishlist-service');
const { requireAuth } = require('../middleware/jwt-auth');

const wishlistRouter = express.Router();
const jsonBodyParser = express.json();


wishlistRouter
  .route('/')
  //.all(requireAuth)
  .post(jsonBodyParser, (req, res, next) => {
    const { user_id, name, url, price } = req.body;
    const newWishlistEntry = { user_id, name, url, price}; 

    for (const [key, value] of Object.entries(newWishlistEntry))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });
    newWishlistEntry.user_id=req.user.id;

    WishlistService.insertWishlistEntry(
      req.app.get('db'),
      newWishlistEntry
    )
      .then(wishlist => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${wishlist.id}`))
          .json(WishlistService.serializeWish(wishlist));
      })
      .catch(next);
  });

wishlistRouter
  .route('/:user_id')
  .get((req, res, next) => {
    const {user_id} = req.params;
    WishlistService.getById(req.app.get('db'), user_id)
      .then(wish => {
        if(!wish) {
          return res.status(404).json({
            error: {message: 'Wishlist not found'}
          });
        }
        res.status(200).json(wish);
        next();
      })
      .catch(next);
  });

module.exports = wishlistRouter;