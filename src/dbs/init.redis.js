const { createClient } = require('redis');
const { host, port, username, password } = require('../configs/config.redis')
const client = createClient({
    host: host,
    port: port
});
client.ping(function (err, result) {
    console.log(result);
})
client.on('connect', () => {
    console.log('Redis client connected');
});

client.on("error", (error) => {
    console.error(error);
});

module.exports = client
