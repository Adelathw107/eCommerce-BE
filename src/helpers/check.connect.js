'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000
// count connection
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log(`Number of connections:: ${numConnection} `);
}

// check overload
const checkOverLoad = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // Example maxium number of connections based on number of cores

        console.log(`Active connection : ${numConnection}`);
        console.log(`Memory  usage:: ${memoryUsage / 1024 / 1024} MB`);

        const maxConnections = numCores * 5;
        if (numConnection > maxConnections) {
            console.log(`Connection Overload detected`);
        }
    }, _SECONDS); // Monitor ever 5 seconds
}
module.exports = { countConnect, checkOverLoad }