--psql -U postgres -d spndr -f I:\Thinkful\projects\spndr-capstone\Server\seeds\trunc.spndr_tables.sql

truncate
  spndr_users,
  spndr_wishlist,
  spndr_income,
  spndr_expenses
  restart identity cascade;