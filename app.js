const inquirer = require("inquirer");
const db = require("./config/connection");
const validator = require("./input_checker/validate");
table = require("console.table");
const logo = require("asciiart-logo");

// function to start the app 
 init =() => {
    const logoIcon = logo({name: 'Employee Manager'}).render()
    console.log(logoIcon)
    start();
}
// start function to call the main to do list 
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
      }
    });
};
// view function to return user choise 
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
      }
    });
};
// add function to reder choises for the user 
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
      }
    });
};
// update function 
const update = () => {
  inquirer
    .prompt([
      {
        name: "edit",
        type: "list",
        message: "Please select on to edit",
        choices: ["Employee Role"],
      },
    ])
    .then((res) => {
      switch (res.edit) {
        case "Employee Role":
          editRole();
          break;

      }
    });
};
// view all department 
allDepartment = () => {
  // sql query to get all the department table infromation 
  db.query(`SELECT dept_name, dept_id FROM department`, (err, result) => {
    // in case of an err throw the err 
    if (err) throw err;
    // if no err print the table 
    console.table(result);
    // call the main menu
    start();
  });
};
// create new department 
const createDept = () => {
  // ask the user to input the department name 
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "Please enter the department name",
        // validate the input 
        validate: (addDepartment) => {
          if (addDepartment) {
            return true;
          } else {
            console.log("Department name is required");
          }
        }
      },
    ])
    // get the input value 
    .then((answers) => {
      // incert the input value by using sql query INSERT into table 
      db.query(
        `INSERT INTO department(dept_name) VALUE (?)`,
        [answers.department],
        (err) => {
          if (err) throw err;
          console.log(
            answers.department + " " + "was add to the department table"
          );
          // call allDepartment function to check if the user want to insert another input
          allDepartment();
        }
      );
    });
};
// view all employee
allEmployee = () => {
  // sql query ti select the employee table and other associateion data
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
// creat employee function
cerateEmployee = () => {
  inquirer
  // prompt the user to enter the employee first and last name 
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Please enter employee first name",
        validate: (isFirstname) => {
          if (isFirstname) {
            return true;
          } else {
            console.log("Employee name is required");
            return false;
          }
        }
      },
      {
        name: "lastName",
        type: "input",
        message: "Please enter employee last name",
        validate: (isLasrName) => {
          if (isLasrName) {
            return true;
          } else {
            console.log("Employee lastname is required");
            return false;
          }
        }
      },
    ])
    .then((answers) => {
      const employee = [answers.firstName, answers.lastName];
      // using sql query to select the role 
      let roles = `SELECT employee_role.role_id, employee_role.job_title FROM employee_role`;
      db.query(roles, (err, result) => {
        if (err) throw err;
        // create role array 
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
              // using role array to allow the user to select from 
              choices: roleArr,
            },
          ])
          // get the answer and push it to employee array 
          .then((selectedRole) => {
            const role = selectedRole.role;
            employee.push(role);
            // select all the employee 
            const manager = `SELECT * FROM employee`;
            db.query(manager, (err, result) => {
              if (err) throw err;
              //generate manager array 
              const managArr = result.map(
                ({ empl_id , first_name, last_name }) => ({
                  name: first_name + " " + last_name,
                  value: empl_id }));
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "leader",
                    message: "Please select employee's manager",
                    // user the generated manager array to allow the user to select from 
                    choices: managArr,
                  },
                ])
                // get the selection and push it to the employee array 
                .then((data) => {
                  console.log(data)
                  const mang = data.leader;
                  employee.push(mang);
                  console.log(mang);
                  // using sql query to insert the generated employee array into the db
                  const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUE (?,?,?,?)`;
                  db.query(sql, employee, (err) => {
                    if (err) throw err;
                    console.log(" A new employee been add to employee table");
                    allEmployee();
                    
                  });
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
      start();
    }
  );
};


createRole = () => {
  // select all department 
  db.query(`SELECT * FROM department`, (err, res) => {
    if (err) throw err;
    deptArr=[];
    // create a dynamic array and push it to the prompt to allow the user to select from 
   res.forEach((department)=>{deptArr.push(department.dept_name);});
   deptArr.push('Create Department')
    inquirer
      .prompt([
        {
          name: "depName",
          type: "list",
          meassage:
            "Please select the departemnt that you want to add the role to!",
            // dynamically generated array 
          choices: deptArr,
        },
      ])
      .then((answers) => {
        // check if the user select new department 
        if (answers.depName === "Create Department") {
          // call the creatDept function to create new department 
          createDept();
        } else {
          // passs the answer to the add role function 
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
                console.log("The Name of the role is required");
                return false;
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
        // get the answer from the prompt 
        .then((answers) => {
          let createdRole = answers.newRole;
          let deptId;

          res.forEach((department) => {
            // check if the slected department match exists department 
            if(data.depName === department.dept_name) {
              // get the id from the exist deparment 
              deptId = department.dept_id;
            }
          });
          console.log("deptid",deptId)
          let sql = `INSERT INTO employee_role(job_title, salary, dept_id) VALUES (?,?,?)`;
          let params = [createdRole, answers.salary, deptId];
          db.query(sql, params, (err) => {
            if (err) throw err;
            console.log("Role successfullt created");
            viewRole();
            
          });
        });
    };
  });
};

 editRole = () => {
    db.query(`SELECT * FROM employee`,(err,res)=>{
        if (err) throw err;
        //create dynamic array to store the employee name 
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
            // create a dynamic list for roles 
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
                  
                });
            });
        });
    });
};


init();
