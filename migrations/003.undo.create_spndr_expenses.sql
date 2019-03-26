alter table spndr_users
  drop column if exists user_id ;

drop table if exists spndr_expenses;