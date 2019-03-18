--psql -U postgres -d spndr -f I:\Thinkful\projects\spndr-capstone\Server\seeds\seed.spndr_tables.sql



begin;

truncate
  spndr_income,
  spndr_expenses,
  spndr_users,
  spndr_wishlist
  restart identity cascade;



insert into spndr_users (user_name, full_name, password)
values
('Jack123', 'Jack Johnson', 'password'),
('Jill456', 'Jillian Giraldi', 'ilovecats'),
('Ron890',' Dan Boomstein', 'gunsandbros69');

insert into spndr_expenses (user_id, name, amount)
values
(1, 'rent', 850.00),
(1, 'car payment', 320.00),
(1, 'child support', 1300.00),
(2, 'mortgage', 800.00),
(2, 'electricity', 100.00),
(3, 'gas', 900.00);

insert into spndr_income (expenses_id, bank_balance, income, add_savings)
values
(1, 120.00, 1200.00, 110.00),
(2, 123.87, 1455.00, 30.00),
(3, 1327.90, 2300.00, 400.00);


insert into spndr_wishlist (user_id, name, url, price)
values
(1, 'computer', 'http://www.newegg.com', 1200.00),
(1, 'cordless drill', 'http://www.homedepot.com', 129.00),
(1, 'dog', 'http://www.petfinder.com', 450.00),
(2, 'cat feeder', 'http://www.chewy.com', 78.99),
(3, 'guns', 'http://www.ammo-r-us.com', 1345.00),
(3, 'truck nuts', 'http://www.amazon.com', 39.99),
(3, 'roids', 'http://www.darkweb.com', 999.99);

commit;