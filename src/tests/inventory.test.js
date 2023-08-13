"use strict";

const redisPubsubService = require("../services/redisPubsub.service");

class InventoryServiceTest {
    constructor() {
        redisPubsubService.subscribe('purchase_events', (channel, message) => {
            InventoryServiceTest.updateInventory(message)
        })
    }

    static updateInventory(productId, quantity) {
        console.log(`Update inventory ${productId} with quantity ${quantity}`);
    }



}

module.exports = new InventoryServiceTest();
