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
    this.isDev = process.env.NODE_ENV !== "production";

    this.database();
    this.middlewares();
    this.routes();
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

  routes() {
    this.express.use(routes);
  }
}

module.exports = new App().express;
