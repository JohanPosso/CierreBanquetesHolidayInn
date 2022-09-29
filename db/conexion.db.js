const express = require("express");
const connection = require("express-myconnection");
const mysql = require("mysql");
const app = express();

app.use(
  connection(
    mysql,
    {
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      port: process.env.PORTDB,
      database: process.env.DATABASE,
    },
    "pool"
  )
);

module.exports = app;
