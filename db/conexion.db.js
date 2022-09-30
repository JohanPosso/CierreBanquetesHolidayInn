const mysql = require("mysql");

const connection = mysql.createPool({
  connectionLimit: 100,
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 1000,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  port: process.env.PORTDB,
  database: process.env.DATABASE,
});

connection.on("acquire", function (connection) {
  console.log("Connection %d acquired", connection.threadId);
});

connection.on("connection", function (connection) {
  connection.query("SET SESSION auto_increment_increment=1");
});

module.exports = connection;
