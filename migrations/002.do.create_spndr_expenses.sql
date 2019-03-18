CREATE TABLE spndr_expenses (
  id serial primary key,
  name text not null,
  amount numeric not null,
  date_created timestamp not null default now()
);

alter table spndr_income
  add column
    expenses_id integer references spndr_expenses(id)
    on delete set null;