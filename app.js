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
          Alldepartment();
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
Alldepartment = async () => {
  const departments = await db.findAlldepartment();
  console.log("=================");
  console.table(departments);
};

allEmployee = async () => {
    const employees = await db.ViewEmployees();
    console.log("=================");
    console.table(employees);

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
