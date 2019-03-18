CREATE TABLE spndr_income (
  id SERIAL PRIMARY KEY,
  bank_balance NUMERIC NOT NULL,
  income NUMERIC NOT NULL,
  add_savings NUMERIC NOT NULL,
  date_created timestamp not null default now()
);

