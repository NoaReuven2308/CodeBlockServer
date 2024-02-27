const winston = require('winston');
require('winston-mongodb'); // Beacuse Testing
require('express-async-errors');


module.exports = function() {
  const logger = winston.createLogger({
    transports: [
      new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    ],
    exceptionHandlers: [
      new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    ]
  });
  
  process.on('unhandledRejection', (ex) => {
    throw ex;
  });
  
  logger.add(new winston.transports.File({ filename: 'logfile.log' }));
  logger.add(new winston.transports.MongoDB({ // For Testing
    db: 'mongodb://localhost/webCoding',
    level: 'info'
  })); 
}
