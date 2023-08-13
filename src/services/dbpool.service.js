'use strict'
const { name_database_01 } = require('../configs/config.mysql')
const databaseService = require('../dbs/init.mysql')

try {
    databaseService.createPool(name_database_01.alias, name_database_01.config);
} catch (error) {
    console.error('Failed to create connection pool for ', name_database_01.alias, ':::', error);
}



// Access the connection pools in another module
const database = databaseService.getPool(name_database_01.alias)

module.exports = {
    database
}