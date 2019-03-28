
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsers() {
  return [
    {
      id: 1,
      user_name: 'test-1',
      full_name: 'test user 1',
      password: 'password' 
    },
    {
      id: 2,
      user_name: 'test-2',
      full_name: 'test user 2',
      password: 'password'
    },
    {
      id: 3,
      user_name: 'test-3',
      full_name: 'test user 3',
      password: 'password'
    },
    {
      id: 4,
      user_name: 'test-4',
      full_name: 'test user 4',
      password: 'password'
    },
  ];
}

function makeExpenses(users) {
  return [
    {
      user_id: users[0].id,
      name:'rent', 
      amount: 850.00
    },
    {
      user_id: users[0].id,
      name:'car payment', 
      amount: 320.00
    },
    {
      user_id: users[1].id,
      name:'child support', 
      amount: 1300.00
    },
    {
      user_id: users[2].id,
      name:'mortgage', 
      amount: 800.00
    },
    {
      user_id: users[2].id,
      name:'electricity', 
      amount: 100.00
    },
    {
      user_id: users[3].id,
      name:'gas', 
      amount: 900.00
    },
  ];
}

function makeIncome(users) {
  return [
    {
      user_id: users[1].id,
      bank_balance: 120.00,
      income: 1200.00,
      add_savings: 110.00
    },
    {
      user_id: users[2].id,
      bank_balance: 123.87,
      income: 1455.00,
      add_savings: 30.00
    },
    {
      user_id: users[3].id,
      bank_balance: 1327.90,
      income: 2300.00,
      add_savings: 400.00
    },
    {
      user_id: users[0].id,
      bank_balance: 1897.90,
      income: 2780.00,
      add_savings: 10.00
    }
  ];
}

function makeWishlist(users) {
  return [
    {
      user_id: users[1].id,
      name: 'computer', 
      url: 'http://www.newegg.com',
      price: 1200.00
    },
    {
      user_id: users[1].id,
      name: 'cordless drill', 
      url: 'http://www.homedepot.com',
      price: 129.00
    },
    {
      user_id: users[1].id,
      name: 'dog', 
      url: 'http://www.petfinder.com',
      price: 450.00
    },
    {
      user_id: users[2].id,
      name: 'cat feeder', 
      url: 'http://www.chewy.com',
      price: 78.99
    },
    {
      user_id: users[3].id,
      name: 'guns', 
      url: 'http://www.ammo-r-us.com',
      price: 1345.00
    },
    {
      user_id: users[3].id,
      name: 'truck nuts', 
      url: 'http://www.amazon.com',
      price: 39.99
    },
    {
      user_id: users[0].id,
      name: 'bitcoin', 
      url: 'http://www.darkweb.com',
      price: 999.99
    }
  ];
}

function makeFixtures() {
  const testUsers = makeUsers()
  const testIncome = makeIncome(testUsers)
  const testExpenses = makeExpenses(testUsers)
  const testwishlist = makeWishlist(testUsers)
  return { testUsers, testIncome, testExpenses, testwishlist }
}

function cleanTables(db) {
  return db.raw(
    `truncate
    spndr_users,
    spndr_expenses,
    spndr_income,
    spndr_wishlist
    restart identity cascade`
  )
}

function seedUsers(db, users) {
  const fakeUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db
    .into('spndr_users')
    .insert(fakeUsers)
}

function seedTables(db, users, income, expenses, wishlist=[] ) {
  return seedUsers(db, users)
    .then(() =>
      db
        .into('spndr_expenses')
        .insert(expenses)
    )
    .then(() =>
      db
        .into('spndr_income')
        .insert(income)

    )
    .then(() =>
      db
        .into('spndr_wishlist')
        .insert(wishlist)
        )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET){
  const token = jwt.sign({user_id: user.id}, secret, 
    {subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`;
}

module.exports = {
makeUsers,
makeExpenses,
makeIncome,
makeWishlist,
makeFixtures,
cleanTables,
seedUsers,
makeAuthHeader,
seedTables
}