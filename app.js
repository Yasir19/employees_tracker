const inquirer = require("inquirer");
const db = require("./config/connection");
require("console.table");

const start = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "start",
        message: "Select one to start:",
        choices: ["View", "Add", "Update", "Exit"],
      },
    ])
    .then((res) => {
      switch (res.start) {
        case "View":
          view();
          break;
        case "Add":
          add();
          break;
        case "Update":
          updateEmployee();
          break;
        case "Exit":
          console.log("=======================");
          console.log("All done");
          console.log("=======================");
          break;
        default:
          console.log("default");
      }
    });
};

const view = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "view",
        message: "Select one to view:",
        choices: ["View By Department", "View All Employee", "View By Role"],
      },
    ])
    .then((res) => {
      switch (res.view) {
        case "View By Department":
          allDepartment();
          break;
        case "View All Employee":
          allEmployee();
          break;
        case "View By Role":
          viewRole();
          break;
        default:
          console.log("default");
      }
    });
};

const add = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "add",
        message: "Select one to add:",
        choices: ["Department", "Employee", "Employee Role"],
      },
    ])
    .then((res) => {
      switch (res.add) {
        case "Department":
          createDept();
          break;
        case "Employee":
          cerateEmployee();
          break;
        case "Employee Role":
          addRole();
          break;
        default:
          console.log("default");
      }
    });
};

allDepartment = () => {
  db.query(`SELECT dept_name, dept_id FROM department`, (err, result) => {
    if (err) throw err;
    console.table(result);
    start();
  });
};
const createDept = () => {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "Please enter the department name",
      },
    ])
    .then((answers) => {
      db.query(
        `INSERT INTO department(dept_name) VALUE (?)`,
        [answers.department],
        (err) => {
          if (err) throw err;
          console.log(
            answers.department + " " + "was add to the department table"
          );
          
        }
      );
      allDepartment();
    });
};
allEmployee = () => {
  db.query(
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
};

cerateEmployee = () => {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Please enter employee first name",
      },
      {
        name: "lastName",
        type: "input",
        message: "Please enter employee last name",
      },
    ])
    .then(answers => {
      const employee = [answers.firstName, answers.lastName];
      let roles = `SELECT employee_role.role_id, employee_role.job_title FROM employee_role`;
      db.query(roles, (err,result) => {
          if(err) throw err;
          const roleArr = result.map(({ role_id, job_title }) => ({
            name: job_title,
            value: role_id,
          })); 
      inquirer
        .prompt([
          {
            type: "list",
            name: "role",
            message: "Pleas select the job title",
            choices: roleArr,
          },
        ])
        .then(selectedRole => {
          const role = selectedRole.role;
          employee.push(role);
          const manager =`SELECT * FROM employee`;
          db.query(manager,(err, result)=>{
              if(err) throw err;
              const managArr = result.map(({ manager_id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: manager_id,
              }));
          inquirer
            .prompt([
              {
                type: "list",
                name: "manager",
                message: "Please select employee's manager",
                choices: managArr,
              },
            ])
            .then(selectedManager => {
              const manager = selectedManager.manager;
              employee.push(manager);
              const sql =`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUE (?,?,?,?)`;
              db.query(sql,employee, (err)=>{
                  if(err) throw err;
                  console.log(' A new employee been add to employee table');
              })
              allEmployee();
            });
        });
    });
});
    });
};
viewRole = () => {
  db.query(
    `select employee_role.job_title, employee_role.role_id, department.dept_name AS department,
           employee_role.salary FROM employee_role LEFT JOIN department ON department.dept_id = employee_role.dept_id`,
    (err, result) => {
      if (err) throw err;
      console.table(result);
    }
  );
};

// const findAlldepartment =() =>{
//     connection.query(
//         "SELECT department.dept_name, department.dept_id FROM department", (err, result)=>{
//             if(err) throw err;
//             console.table(result);
//         }
//     );
// };
start();
