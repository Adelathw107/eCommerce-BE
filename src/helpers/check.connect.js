'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECOND = 5000

// count Connect
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connections :: ${numConnection}`)

}


const checkOverLoad = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss

        console.log(`Memmory usage ::: ${memoryUsage / 1024 / 1024} MB`);

        const maxConnections = numCores * 5
        if (numConnection >= maxConnections) {
            console.log("Connnection overload detected");
        }
    }, _SECOND)

}

module.exports =
{
    countConnect,
    checkOverLoad
}