"use strict";

const configRedis = {
    enable: process.env.REDIS_ENABLE || true,
    port: process.env.REDIS_PORT || 'localhost',
    host: process.env.REDIS_HOST || 6379,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
};


module.exports = configRedis
