const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");

// Create a transport for daily log rotation
const transport = new transports.DailyRotateFile({
    filename: 'logs/%DATE%.log', // Pattern for filenames
    datePattern: 'YYYY-MM-DD', // Date format
    zippedArchive: true, // Optional: compress log files
    maxSize: '20m', // Maximum size of log files
    maxFiles: '14d', // Keep logs for 14 days
});

// Create the logger
const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }), // Custom timestamp format
        format.printf(({ timestamp, level, message }) => {
            return `${level}: [${timestamp}]: ${message}`; // Custom log message format
        })
    ),
    transports: [
        transport // Only log to the daily rotate file
    ],
});

const neverLog = new Set([
    '/api/readApi',
    '/inventory/readInventory',
    '/member/logout',
    '/member/login',
    '/member/readMember',
    '/member/register',
    '/order/exportDailyMeetSummary',
    '/order/readHistoryOrder',
    '/order/readOrder',
    '/order/readOrderDetail',
    '/product/readProduct',
    '/setting/readAllSetting',
    '/setting/readSetting',
    '/shop/readBindProduct',
    '/shop/readPartition',
    '/shop/readShop',
])
const addLog = (req, res, next) => {
    if(!neverLog.has(req.path)){
        const userName = req.userInfo ? req.userInfo.name : '';
        logger.info(`${req.method} ${userName} ${req.url} ${JSON.stringify(req.body)}`);
    }
    next();
  }

module.exports = addLog;