"use strict";
const mongoose = require("mongoose");
const {
  db: { host, port, name },
} = require("../configs/config.mongodb.js");
// const { countConnect, checkOverLoad } = require("../helpers/check.connect.js");

const connectString = `mongodb://${host}:${port}/${name}`;

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
      console.error("Error connecting to MongoDB:", error);
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
