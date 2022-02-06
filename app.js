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
              console.log('default');
      }
    });
}

const view = () => {
     inquirer
    .prompt([
      {
        type: "list",
        name: "view",
        message: "Select one to view:",
        choices: [
          'View By Department',
          'View All Employee',
          'View By Role',
        ],
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
              console.log('default');
      }
    });
}

const add = () => {
    inquirer
   .prompt([
     {
       type: "list",
       name: "add",
       message: "Select one to add:",
       choices: [
         'Department',
         'Employee',
         'Employee Role',
       ],
     },
   ])
   .then((res) => {
     switch (res.add) {
       case "Department":
        createDept();
         break;
       case "Employee":
         addEmployee();
         break;
       case "Employee Role":
         addRole();
         break;
         default:
             console.log('default');
     }
   });
}



allDepartment = () => {
  const departments = db.findAlldepartment();
  console.log("=================");
  console.table( departments);
  start();
};
const createDept = () =>{
    inquirer 
    .prompt([
        {
            name: 'department',
            type: 'input',
            message: 'Please enter the department name'
        }
    ]).then((answers) => {
        const dept =db.addedDepartment(answers);
        const viewdepartment = db.findAlldepartment();
        (err) =>{
            if (err) throw err
            console.log(dept);
            console.log('-------------------------------')
            console.table(viewdepartment);
            start()
        }
    })
} 

allEmployee = () => {
    const employees = db.ViewEmployees();
    console.log("=================");
    console.table( employees);
    start();
}
viewRole = () => {
    const roles = db.ViewEmployeesRole();
    console.log("=================");
    console.table( roles);
    start();
}

addDepartment = () => {
    const department = db.addedDepartment();
    console.log("=================");
    console.log(department);
    start();

}
// const findAlldepartment =() =>{
//     connection.query(
//         "SELECT department.dept_name, department.dept_id FROM department", (err, result)=>{
//             if(err) throw err;
//             console.table(result);
//         }
//     );
// };
start();
