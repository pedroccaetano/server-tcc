require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");

const databaseConfig = require("./config/database");

class App {
  constructor() {
    this.express = express();
    this.express.use(cors());

    this.middlewares();
    this.database();
    this.routes();
  }

  routes() {
    this.express.use(routes);
  }

  async database() {
    await mongoose
      .connect(databaseConfig.uri, {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true
      })
      .catch(error => {
        console.error("Erro ao tentar acessar a base de dados: ", error);
      });
  }

  middlewares() {
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(express.json());
  }
}

module.exports = new App().express;
