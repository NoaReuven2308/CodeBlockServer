const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');


// module.exports = function() {
//   const db = config.get('db');
//   mongoose.connect(db)
//     .then(() => winston.info(`Connected to ${db}...`));
// }

module.exports = function() {
  winston.add(new winston.transports.Console({
    format: winston.format.simple(),
    level: 'info' // Adjust log level as needed
  }));

  //const db = 'mongodb://localhost/webCoding';
  const db = config.get('db');
  mongoose.connect(db)
  .then(() => winston.info(`Connected to ${db}...`))
  .catch(err => winston.error('Could not connect to MongoDB...', err));

}
