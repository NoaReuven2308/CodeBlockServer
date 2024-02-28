const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

/**
 * Logging and Database Connection Setup:
 * Configures Winston logger and establishes connection to MongoDB using Mongoose.
 */
module.exports = function() {
  // Configure Winston logger to log to console
  winston.add(new winston.transports.Console({
    format: winston.format.simple(),
    level: 'info' // Adjust log level as needed
  }));

  // Get database URI from configuration
  const db = config.get('db');

  // Connect to MongoDB
  mongoose.connect(db)
    .then(() => winston.info(`Connected to ${db}...`))
    .catch(err => winston.error('Could not connect to MongoDB...', err));
}
