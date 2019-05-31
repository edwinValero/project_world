const { createLogger, format, transports } = require('winston');
const { colorize, printf, combine, simple, timestamp, json } = format;

const logger = createLogger({
  transports: [
    new transports.Console({
      level: 'info',
      format: combine(
        colorize(),
        timestamp(),
        printf(info => `[${info.level}] ${info.timestamp} ${info.message}`)
      ),
    }),
    new transports.File({
      format: combine(timestamp(), json()),
      filename: 'error.log',
      level: 'warn',
    }),
  ],
});

module.exports = logger;
