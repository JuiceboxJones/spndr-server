'use strict';
const bcrypt = require('bcryptjs');
/* 'password' 'bo-password' 'charlie-password' 'sam-password' 'lex-password' 'ping-password' */
bcrypt.hash('password', 12).then(hash => console.log({ hash }));
bcrypt.hash('ilovecats', 12).then(hash => console.log({ hash }));
bcrypt.hash('gunsandbros69', 12).then(hash => console.log({ hash }));
