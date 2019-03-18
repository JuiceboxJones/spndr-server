create table spndr_users (
  id serial primary key,
  user_name text not null unique,
  full_name text not null,
  password text not null,
  date_created timestamp not null default now(),
  date_modified timestamp
);

alter table spndr_expenses
  add column
    user_id integer references spndr_users(id)
    on delete set null;