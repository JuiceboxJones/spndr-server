alter table spndr_income
  drop column if exists user_id;
  
drop table if exists spnd_users;