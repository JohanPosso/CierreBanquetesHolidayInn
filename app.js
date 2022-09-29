const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require("express-session");
require("dotenv").config();
// const expressValidator = require("express-validator");
const methodOverride = require("method-override");

const routerApi = require("./routes/index");
const routesCustomer = require("./routes/customers");
const app = express();

app.set("view engine", "jade");
app.set("views", path.join(__dirname, "views"));

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: "secretpass123456" }));
app.use(flash());
// app.use(expressValidator());
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routesCustomer);
routerApi(app);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   const err = new Error("Not Found");
//   err.status = 404;
//   next(err);
// });

module.exports = app;
