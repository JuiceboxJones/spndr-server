CREATE TABLE spndr_expenses (
  id serial primary key,
  name text not null,
  amount numeric not null,
  date_created timestamp not null default now(),
  user_id integer 
   references spndr_users(id) on delete cascade not null
);
