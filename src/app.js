
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
// const { openApi, configSwagger } = require("./configs/config.swagger.js");
// const expressWinston = require('express-winston');
// const { logger } = require('./configs/config.logger');
// const config = require("./configs/config.js");
// const { pushToDiscord } = require('./middlewares');
// const { is404Handler, returnError } = require("./middlewares/errorHandler.js");

const app = express();

// init middlewares
app.use(morgan("dev"));
// combined, short, tiny

// content security policy
app.use(helmet.contentSecurityPolicy({
    directives: {
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
    },
}));
// x content type options
app.use(helmet.noSniff());
// x xss protection
app.use(helmet.xssFilter());
// referrer policy
app.use(helmet.referrerPolicy({
    policy: "no-referrer",
}));

// app.use(compression());
// Compression
// downsize response
app.use(compression({
    level: 6,// level compress
    threshold: 100 * 1024, // > 100kb threshold to compress

    filter: (req) => {
        return !req.headers['x-no-compress'];
    }

}));

app.use(express.json());
app.use(express.urlencoded({ extends: true }));

// test pub.sub redis
// require('./tests/inventory.test')
// const productTest = require('./tests/product.test')
// productTest.purchaseProduct('product:001', 10)


// init db
require("./dbs/init.mongodb.js");
// const { countConnect, checkOverLoad } = require("./helpers/check.connect.js")
// checkOverLoad();

// init redis
// require('./dbs/init.redis.js');

// init swagger
// configSwagger(app);
// openApi(app);

// init logger
// app.use(expressWinston.logger({
//     winstonInstance: logger,
//     statusLevels: true
// }));

// config i18n
// if (config.i18n.enable === true) {
//     const i18n = require("./configs/config.i18n.js");
//     app.use(i18n.init);
// }

// Logs to discord
// app.use(pushToDiscord);


// init routes
app.use("", require("./routes/index.js"));

// handling errors
// app.use(is404Handler);
// app.use(returnError);


// init cron
// if (config.task.enable === true) {
//     const task = require('./tasks/collect-issue.task');
//     task.execute().start();
// }

module.exports = app;
