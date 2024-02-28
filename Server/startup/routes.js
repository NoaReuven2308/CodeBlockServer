const express = require('express');
const codeBlocks = require('../routes/codeBlocks');
const error = require('../middleware/error');

/**
 * Express Middleware Setup:
 * Configures middleware for handling JSON requests, routing for code blocks, and error handling.
 * @param {Object} app - Express application object
 */
module.exports = function(app) {
  // Parse JSON requests
  app.use(express.json());
  
  // Route requests for code blocks
  app.use('/api/codeblocks', codeBlocks);
  
  // Error handling middleware
  app.use(error);
}
