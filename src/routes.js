const express = require("express");

const notaMiddleware = require("./app/middlewares/crawler");
const authMiddleware = require("./app/middlewares/auth");

const NotaController = require("./app/controllers/NotaController");
const UserController = require("./app/controllers/UserController");
const SessionController = require("./app/controllers/SessionController");

const routes = express.Router();

routes.get("/", (req, res) =>
  res.send("API/CRAWLER do Portal da Nota Fiscal Eletrônica")
);

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

routes.use(authMiddleware);

routes.post("/nota/store", notaMiddleware, NotaController.store);
routes.get("/nota/date/:dateString", NotaController.findByDate);
routes.get(
  "/nota/date/initDate/:initDate/finalDate/:finalDate/productName/:productName/barcode/:barcode/organization/:organization",
  NotaController.find
);
routes.post("/nota/destroy", NotaController.destroy);
routes.post("/nota/update", NotaController.update);
routes.get("/nota/show", NotaController.show);

module.exports = routes;
