-- seeding data into the table
INSERT INTO department (dept_name)
value
('IT'),
('Engineering'),
('Finance'),
('Marketing'),
('HR');

INSERT INTO employee_role (job_title, salary, dept_id)
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
  ('Henry', 'Butler', 1, NULL),
  ('James', 'Smith', 2, 1),
  ('Edward', 'Bellamy', 3, 1),
  ('Salah', 'ALi', 4, NUll),
  ('Noah', 'Carrington', 5, 4),
  ('Katherine', 'Mansfield', 6, NULL),
  ('Kunal', 'Singh', 7, 6),
  ('Sura', 'Davis', 8, NULL),
  ('Virginia', 'Brown', 9, 8),
  ('Mike', 'Ledger', 10, NULL),
  ('Olivi', 'Miller', 11, 10);


  
  
  
  


  

  

