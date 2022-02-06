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
  viewEmployees() {
    return this.db.query(
      `SELECT employee.empl_id AS empl, employee.first_name, employee.last_name,
      employee_role.job_title AS title,department.dept_name AS department,
      employee_role.salary, CONCAT(manager.first_name," ",manager.last_name) AS manager
      from employee LEFT JOIN employee_role ON employee.role_id = employee_role.role_id
      LEFT JOIN department On employee_role.dept_id = department.dept_id 
      LEFT JOIN employee manager ON
      manager.empl_id = employee.manager_id`,
      (err, result) => {
        if (err) throw err;
        console.table(result);
      }
    );
  }
  ViewEmployeesRole() {
    return this.db.query(
      `select employee_role.job_title, employee_role.role_id, department.dept_name AS department,
         employee_role.salary FROM employee_role LEFT JOIN department ON department.dept_id = employee_role.dept_id`,
      (err, result) => {
        if (err) throw err;
        console.table(result);
      }
    );
  }
  addDepartment(answers) {
    return this.db.query(
      `INSERT INTO department(dept_name) VALUE (?)`,
      [answers.department],
      (err) => {
        if (err) throw err;
        console.log(
          answers.department + " " + "was add to the department table"
        );
      }
    );
  }
  selectRole() {
      return this.db.query(
          `SELECT employee_role.role_id, employee_role.job_title FROM employee_role`, (err, result) =>{
              if(err) throw err;
              const roles = result.map(({role_id, job_title }) => ({name:job_title, value:role_id}));
              console.log(roles);
          }
          );
  }
  selectManager() {
      return this.db.query(
          `SELECT * FROM employee`,(err,result) => {
              if(err) throw err;
              const managers = result.map(({ manager_id ,first_name, last_name }) => ({name: first_name+' '+ last_name, value:manager_id}))
          }

      );
  }
  addEmployee = (answers) => {
      const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUE (?,?,?,?)`;
      const params = [ 
       answers.employee
      ];
    return this.db.query(sql, params, 
      (err) => {
        if (err) throw err;
        console.log('employee been add to employee table');
      }
    );
  };
}

module.exports = new QUERY(db);
