INSERT INTO department (dept_name)
value
('IT'),
('Engineering'),
('Finance'),
('Marketing'),
('HR');

INSERT INTO employee_role (job_title, salary,dept_id)
VALUE 
('System Analysis',80000, 1),
('Network Administrator', 84000,1),
('IT Manager',105000,1),
('Software Engineer', 112000,2),
('lead Engineer',130000,2),
('Accountant',90000,3),
('Account Manager',125000,3),
('Content marketing specialist',60000,4),
('Digital marketing manager',88000,4),
('Recruiter',59000,5),
('recruiting manager',82000,5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE
  ('James', 'Smith', 1, 3),
  ('Edward', 'Bellamy', 2, 3),
  ('Henry', 'Butler',3,NULL),
  ('Noah', 'Carrington', 4, 5),
  ('Salah', 'ALi', 5, NUll),
  ('Kunal', 'Singh', 6, 7),
  ('Katherine', 'Mansfield', 7, NULL),
  ('Virginia', 'Brown', 8, 9),
  ('Sura', 'Davis', 9, NULL),
  ('Olivi', 'Miller', 10, 11),
  ('Mike', 'Ledger', 11, NULL);

  
  
  
  


  

  

