const inquirer = require("inquirer");
const db = require("./config/connection");
const validator = require("./input_checker/validate");

table = require("console.table");

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
          update();
          break;
        case "Exit":
          console.log("=======================");
          console.log("All done");
          console.log("=======================");
          db.end();
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
          createRole();
          break;
        default:
          console.log("default");
      }
    });
};

const update = () => {
  inquirer
    .prompt([
      {
        name: "edit",
        type: "list",
        message: "Please select on to edit",
        choices: ["Employee", "Employee Role"],
      },
    ])
    .then((res) => {
      switch (res.edit) {
        case "Employee":
          editEmployee();
          break;
        case "Employee Role":
          editRole();
          break;
        default:
          console.lof("default");
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
        validate: (addDepartment) => {
          if (addDepartment) {
            return true;
          } else {
            console.log("Department name is required");
          }
        },
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
      start();
    });
};

const allEmployee = () => {
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
      start();
    }
  );
};

const cerateEmployee = () => {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Please enter employee first name",
        validate: (isFirstname) => {
          if (isFirstname) {
            return true;
          } else {
            return "Employee name is required";
          }
        },
      },
      {
        name: "lastName",
        type: "input",
        message: "Please enter employee last name",
        validate: (isLasrName) => {
          if (isLasrName) {
            return true;
          } else {
            return "Employee lastname is required";
          }
        },
      },
    ])
    .then((answers) => {
      const employee = [answers.firstName, answers.lastName];
      let roles = `SELECT employee_role.role_id, employee_role.job_title FROM employee_role`;
      db.query(roles, (err, result) => {
        if (err) throw err;
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
          .then((selectedRole) => {
            const role = selectedRole.role;
            employee.push(role);
            const manager = `SELECT * FROM employee`;
            db.query(manager, (err, result) => {
              if (err) throw err;
              const managArr = result.map(
                ({ manager_id, first_name, last_name }) => ({
                  name: first_name + " " + last_name,
                  value: manager_id,
                })
              );
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Please select employee's manager",
                    choices: managArr,
                  },
                ])
                .then((selectedManager) => {
                  const manager = selectedManager.manager;
                  employee.push(manager);
                  const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUE (?,?,?,?)`;
                  db.query(sql, employee, (err) => {
                    if (err) throw err;
                    console.log(" A new employee been add to employee table");
                  });
                  allEmployee();
                  start();
                });
            });
          });
      });
    });
};

const editEmployee = () => {};
const viewRole = () => {
  db.query(
    `select employee_role.job_title, employee_role.role_id, department.dept_name AS department,
           employee_role.salary FROM employee_role LEFT JOIN department ON department.dept_id = employee_role.dept_id`,
    (err, result) => {
      if (err) throw err;
      console.table(result);
      start();
    }
  );
};

const createRole = () => {
  db.query(`SELECT * FROM department`, (err, res) => {
    if (err) throw err;
    let deptArr = [];
    res.forEach((department) => {
      deptArr.push(department.dept_name);
    });

    deptArr.push("newDept");
    inquirer
      .prompt([
        {
          name: "departentName",
          type: "list",
          meassage:
            "Please select the departemnt that you want to add the role to!",
          choices: deptArr,
        },
      ])
      .then((answers) => {
        if (answers.deptArr === "newDetp") {
          this.createDept();
        } else {
          addRole(answers);
        }
      });
    addRole = (data) => {
      inquirer
        .prompt([
          {
            name: "newRole",
            type: "input",
            message: "What is the name of your role?",
            validate: (answer) => {
              if (answer) {
                return true;
              } else {
                return "The Name of the role is required";
              }
            },
          },
          {
            name: "salary",
            type: "input",
            message: "please enter the salary associated to this role",
            validate: validator.validateSalary,
          },
        ])
        .then((answers) => {
          let createdRole = answers.newRole;
          let deptId;

          res.forEach((department) => {
            if (data.deptArr === department.dept_name) {
              deptId = department.dept_id;
            }
          });
          let sql = `INSERT INTO employee_role(job_title, salary, dept_id) VALUES (?,?,?)`;
          let params = [createdRole, answers.salary, deptId];
          db.query(sql, params, (err) => {
            if (err) throw err;
            console.log("Role successfullt created");
            viewRole();
            start();
          });
        });
    };
  });
};
const editRole = () => {
    db.query(`SELECT * FROM employee`,(err,res)=>{
        if (err) throw err;
        const employee =res.map(({empl_id, first_name, last_name})=>({
            name: first_name + " " + last_name,
            value:empl_id
        }))
        inquirer
        .prompt([
            {
                name: "selectedEmpl",
                type: "list",
                message: "Select an employee to update his role",
                choices:employee
            }
        ])
        .then((answer)=>{
            const saveName= answer.selectedEmpl;
            db.query(`SELECT * FROM employee_role`,(err, res)=>{
                if (err) throw err;
                const role = res.map(({role_id, job_title})=>({
                    name: job_title,
                    value: role_id,
                }))
                inquirer
                .prompt([
                    {
                        name: "selectRole",
                        type: "list",
                        message: "What is the employee  new role?",
                        choices:role
                    }
                ]).then((answers)=>{
                    const saveRole=answers.selectRole;
                    console.log(saveName);
                        console.log(saveRole);
                    db.query(`UPDATE employee SET ? WHERE empl_id = ?`,
                    [
                        {
                            role_id:saveRole
                        }, saveName
                    ],
                    )
                    console.log('Employee Role Updated');
                    allEmployee();
                    start();
                });
            });
        });
    });
};


start();
