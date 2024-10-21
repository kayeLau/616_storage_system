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

module.exports = logger;