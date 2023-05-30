'use strict'
const mongoose = require('mongoose')
const { countConnect } = require("../helpers/check.connect.js")

const connectString = 'mongodb+srv://quynguyen:root@quynguyen.btv8uyn.mongodb.net/webApp?retryWrites=true&w=majority'

class Database {

    constructor() {
        this.connect();
    }

    // connect
    connect() {
        // dev
        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }

        mongoose.connect(connectString)
            .then(() => {
                console.log('Connected to MongoDB successfully')
                countConnect();
            }
                // You can start your application logic here
            )
            .catch((error) => {
                console.error('Error connecting to MongoDB:', error);
            });
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb;