const mysql = require("mysql2")
require('dotenv').config();
// Conect to database
const db = mysql.createConnection(
    
    {
      host: process.env.HOST,
      //MySQL username,
      user: process.env.DB_USER,
      //MySQL password
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
  );

  db.connect((err)=>{
    if(err) throw err;
    console.log("connected to the employee_tracker_db.")
  
  });
  module.exports = db;

