'use strict';
module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/spndr',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-secret',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN
};
