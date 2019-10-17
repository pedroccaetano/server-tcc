import express from "express";

import notaMiddleware from "./app/middlewares/crawler";
import authMiddleware from "./app/middlewares/auth";

import NotaController from "./app/controllers/NotaController";
import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";

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

// export default routes;
