CREATE TABLE spndr_expenses (
  id serial primary key,
  name text not null,
  amount numeric not null,
  date_created timestamp not null default now()
);