const inquirer = require("inquirer");
const db = require("./db");
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
  const departments = db.findAlldepartment();
  const x = db.selectRole();
  console.log("=================");
  console.table(departments);
  console.log(x);
  start();
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
      const dept = db.addDepartment(answers);
      const viewdepartment = db.findAlldepartment();
      (err) => {
        if (err) throw err;
        console.log(dept);
        console.log("-------------------------------");
        console.table(viewdepartment);
        start();
      };
    });
};

allEmployee = () => {
  const employees = db.viewEmployees();
  console.log("=================");
  console.table(employees);
  start();
};
cerateEmployee = () => {
  const newEmployee = [];
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
    .then((answers) => {
      const employee = [answers.firstName, answers.lastName];
      const roles = db.selectRole();
      inquirer
        .prompt([
          {
            type: "list",
            name: "role",
            choices: roles,
          },
        ])
        .then((selectedRole) => {
          const role = selectedRole.role;
          employee.push(role);
          const mang = db.selectManager();
          inquirer
            .prompt([
              {
                type: "list",
                name: "manager",
                message: "Please select employee's manager",
                choices: mang,
              },
            ])
            .then((selectedManager) => {
              const manager = selectedManager.manager;
              employee.push(manager);
              const newEmployee = db.addEmployee(employee);
              console.log(newEmployee);
              allEmployee();
            });
        });
    });
};
viewRole = () => {
  const roles = db.ViewEmployeesRole();
  console.log("=================");
  console.table(roles);
  start();
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
