const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  port: 3306,
  database: "dbseven",
});

module.exports = pool;
// svc.sel5.cloudtype.app:31513
