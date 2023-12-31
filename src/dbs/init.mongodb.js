"use strict";

const mongoose = require("mongoose");
// const {
//   db: { host, port, name },
// } = require("../configs/config.mongodb.js");
// const { logger } = require("../configs/config.logger.js");
// const { countConnect, checkOverLoad } = require("../helpers/check.connect.js");

// const connectString = `mongodb://${host}:${port}/${name}`;
const connectString = process.env.CONNECT_MONGO_DB;

class Database {
  constructor() {
    this.connect();
  }

  async connect() {
    try {
      if (1 === 1) {
        mongoose.set("debug", true);
        mongoose.set("debug", { color: true });
      }
      await mongoose.connect(connectString);
      console.log("Connected to MongoDB successfully");
      // countConnect();
      // checkOverLoad();
    } catch (error) {
      // logger.error("Error connecting to MongoDB:", error);
      console.log("Error connecting to MongoDB:", error);      
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
