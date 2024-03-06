const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "library_management",
});

db.connect((err) => {
  if (err) {
    console.error("Error Connection To Database: ", err);
  }
  console.log("Database successfully connected");
});

module.exports = db;
