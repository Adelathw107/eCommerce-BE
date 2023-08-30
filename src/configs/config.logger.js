const { createLogger, transports, format } = require('winston');
const { logger: { serviceName } } = require('./config');


// format log
const formatLog = format.combine(
    format.label({ label: `${serviceName}` }),
    format.json(),
    format.timestamp(), // timestamp log
    format.metadata(),
    format.prettyPrint(),


);

// config file log rotate
require('winston-daily-rotate-file');

const transport = new transports.DailyRotateFile({
    filename: `./logs/${serviceName}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: formatLog
});

transport.on('rotate', function (oldFilename, newFilename) {
    // do something fun
});


const logger = createLogger({
    transports: [
        transport,
    ],
    format: formatLog
});

// check add log console
if (process.env.NODE_ENV !== 'productions') {
    logger.add(new transports.Console({
        format: formatLog
    }));
}

module.exports = {
    logger
};