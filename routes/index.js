const express = require("express");
const router = express.Router();
const customers = require("./customers");

function routerApi(app) {
  app.use("/api/v1", router);
  app.use("/customers", customers);
  router.use("/customers", customers);
}

module.exports = routerApi;
