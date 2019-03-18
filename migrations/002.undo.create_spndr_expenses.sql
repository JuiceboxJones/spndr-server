alter table spndr_income
  drop column if exists expenses_id ;

drop table if exists spndr_expenses;