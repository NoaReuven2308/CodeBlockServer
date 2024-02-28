const mongoose = require('mongoose');
 // Validate ID Middleware:
 // Validates if the provided ID is a valid MongoDB ObjectId.
module.exports = function(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send('Invalid ID.');
  
  next();
}
