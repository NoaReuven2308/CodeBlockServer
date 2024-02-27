const express = require('express');
const codeBlocks = require('../routes/codeBlocks');
const error = require('../middleware/error');


module.exports = function(app) {
  app.use(express.json());
  app.use('/api/codeblocks', codeBlocks);
  app.use(error);
}