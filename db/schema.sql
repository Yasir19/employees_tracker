CREATE TABLE department(
    dept_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(30) NOT NULL
);

CREATE TABLE employee_role(
    role_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    job_title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    dept_id INTEGER,
    CONSTRAINT fk_department FOREIGN KEY (dept_id) REFERENCES department(dept_id) ON DELETE CASCADE
);
CREATE TABLE employee(
    empl_id INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    CONSTRAINT fk_employee_role FOREIGN KEY (role_id) REFERENCES employee_role(role_id) ON DELETE CASCADE,
    manager_id INTEGER UNSIGNED,
    INDEX man_ind (manager_id),
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(empl_id) ON DELETE SET NULL
);
