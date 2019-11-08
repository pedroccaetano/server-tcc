const express = require("express");

const notaMiddleware = require("./app/middlewares/crawler");
const authMiddleware = require("./app/middlewares/auth");

const NotaController = require("./app/controllers/NotaController");
const UserController = require("./app/controllers/UserController");
const SessionController = require("./app/controllers/SessionController");

const routes = express.Router();

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

routes.use(authMiddleware);

routes.post("/nota/store", notaMiddleware, NotaController.store);
routes.get("/nota/date/:dateString", NotaController.findByDate);
routes.get(
  "/nota/date/initDate/:initDate/finalDate/:finalDate/productName/:productName/barcode/:barcode/organization/:organization/state/:state",
  NotaController.find
);

module.exports = routes;
