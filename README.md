##Spndr API

This API is for use with the SPNDR Client only.

##-Endpoints-

##Authorization

'/auth/login'

POST only. This endpoint is used for the authentication of user credentials.
user_name and password are required.

##Users

'/users'

POST and GET are available for this endpoint. This is used for
the creation of new users.

POST requires 'password', 'user_name', and 'full_name'
GET requires 'user_name' and 'user_id'

##Expenses

'/expenses'

POST, GET, and DELETE are available for authenticated users.
This endpoint requires a JSONWebToken for all access methods.
POST requires 'name' and 'amount'.
GET requires 'user_id'

endpoint for DELETE

'/expenses/:item_id'
DELETE requires 'id'

##Income

'/income'

POST, GET, and DELETE are available for authenticated users.
This endpoint requires a JSONWebToken for all access methods.
POST requires 'bank_balance', 'income', and 'add_savings'.
GET requires 'user_id'

endpoint for DELETE

'/income/:income_id'
DELETE requires 'id'

##Wishlist

'/wishlist'

POST, GET, and DELETE are available for authenticated users.
This endpoint requires a JSONWebToken for all access methods.
POST requires 'name', 'url', and 'price'.
GET requires 'user_id'

endpoint for DELETE

'/wishlist/:item_id'
DELETE requires 'id'