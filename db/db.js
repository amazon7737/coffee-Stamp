const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "svc.sel5.cloudtype.app",
  user: "root",
  password: "0000",
  port: 31513,
  database: "dbseven",
});

module.exports = pool;
// svc.sel5.cloudtype.app:31513
