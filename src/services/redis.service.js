'use strict'

// const redis = require('redis')
// const { promisify } = require('util');
const { reservationInventory } = require('../models/repository/inventory.repo')
const { setnx, pexpire, delAsyncKey, set, get } = require('../utils/redis.util');

// const client = redis.createClient()
// // set: Set the string value of a key

const testRedis = async () => {
    await set('abc', 123);
    return await get('abc')
}


const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`;
    const retryTimes = 10;
    const expireTime = 3000;

    for (let i = 0; i < retryTimes; i++) {
        const result = await setnx(key, expireTime)
        console.log(`result::: `, result);

        if (result === 1) {
            // thao tac voi inventory
            const isReversation = await reservationInventory({ productId, quantity, cartId })
            if (isReversation.modifiedCount) {
                await pexpire(key, expireTime)
                return key;
            }

            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async keyLock => {
    // const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock,
    testRedis
}