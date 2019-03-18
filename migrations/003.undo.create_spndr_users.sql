alter table spndr_expenses
  drop column if exists user_id;
  
drop table if exists spnd_users;