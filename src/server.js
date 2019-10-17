require("dotenv").config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes";

import databaseConfig from "./config/database";

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
        // console.log(error);
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
