create table spndr_wishlist (
  id serial primary key,
  name text not null,
  url text not null,
  price numeric not null,
  date_created timestamp not null default now(),
  date_modified timestamp,
  user_id integer 
   references spndr_users(id) on delete cascade not null
);
