const db = require("./connection");

class QUERY {
  constructor(db) {
    this.db = db;
  }
  findAlldepartment() {
    return this.db.query(
      `SELECT dept_name, dept_id FROM department`,
      (err, result) => {
        if (err) throw err;
        console.table(result);
      }
    );
  }
  ViewEmployees() {
    return this.db.query(
      `SELECT employee.*, employee_role.job_title AS title,
      department.dept_name AS department, employee_role.salary, 
      CONCAT(manager.first_name," ",manager.last_name) AS manager
      from emplyee LEFT JOIN employee_role ON employee.role_id = role.role_id
      LEFT JOIN department On employee_role.dept_id = department.dept_id 
      LEFT JOIN employee manager ON
      manager.empl_id = employee.manager_id`, (err, result =>{        
          if (err) throw err;
          console.table(result);
      })
    );
  }
}

module.exports = new QUERY(db);
