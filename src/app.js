require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const { openApi, configSwagger } = require("./configs/config.swagger.js");

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
require('./dbs/init.redis.js');
configSwagger(app);
openApi(app);

// init routes
app.use("", require("./routes/index.js"));

// handling errors
app.use(
    (req, res, next) => {
        const error = new Error("Not Found");
        error.status = 404;
        next(error);
    });
app.use(
    (error, req, res, next) => {
        const statusCode = error.status || 500;
        return res.status(statusCode).json({
            status: 'error',
            code: statusCode,
            stack: error.stack,
            message: error.message || "Internal Server Error"
        });
    });

module.exports = app;
