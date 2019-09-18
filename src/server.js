require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

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
        useNewUrlParser: true
      })
      .catch(error => {
        console.log(error);
      });
  }

  middlewares() {
    this.express.use(express.json());
  }

  routes() {
    this.express.use(require("./routes"));
  }
}

module.exports = new App().express;
