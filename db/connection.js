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
    console.log("connected to the election database.")
  );

  module.exports = db;