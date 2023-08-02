"use strict";

const mysql = require('mysql');

class Database {
  constructor() {
    this.connection = null;
    this.connect();
  }

  async connect() {
    try {
      this.connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: "demo_name"
      });

      await new Promise((resolve, reject) => {
        this.connection.connect((err) => {
          if (err) {
            console.error("Error connecting to MySQL:", err);
            reject(err);
          } else {
            console.log("Connected to MySQL successfully");
            resolve();
          }
        });
      });

    } catch (error) {
      console.error("Error connecting to MySQL:", error);
      throw error;
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  getConnection() {
    if (!this.connection || this.connection.state === 'disconnected') {
      throw new Error("MySQL connection is not established.");
    }
    return this.connection;
  }

  async closeConnection() {
    if (this.connection && this.connection.state !== 'disconnected') {
      await new Promise((resolve, reject) => {
        this.connection.end((err) => {
          if (err) {
            console.error("Error closing MySQL connection:", err);
            reject(err);
          } else {
            console.log("MySQL connection closed successfully");
            resolve();
          }
        });
      });
    }
  }
}

const instanceMySql = Database.getInstance();
module.exports = instanceMySql;
