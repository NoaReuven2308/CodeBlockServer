const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

/**
 * Logging Setup:
 * Configures Winston logger with file and MongoDB transports.
 */
module.exports = function() {
  // Create a logger instance
  const logger = winston.createLogger({
    transports: [
      // Log uncaught exceptions to a file
      new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    ],
    // Handle uncaught exceptions and log them to the same file
    exceptionHandlers: [
      new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    ]
  });
  
  // Throw unhandled rejections as exceptions to be caught by the logger
  process.on('unhandledRejection', (ex) => {
    throw ex;
  });
  
  // Add file transport for regular logging
  logger.add(new winston.transports.File({ filename: 'logfile.log' }));
  
  // Add MongoDB transport for testing purposes
  logger.add(new winston.transports.MongoDB({
    db: 'mongodb://mongo:611BGc5Hh5aC45bAg56-Cfe-14a4cgED@roundhouse.proxy.rlwy.net:13646',
    //db: 'mongodb://localhost/webCoding',
    level: 'info'
  })); 
}
