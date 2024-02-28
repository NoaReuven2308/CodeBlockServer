  // Middleware function that wraps the provided handler function with error handling


module.exports = function (handler) {
    return async (req, res, next) => {
      try {
        await handler(req, res);
      }
      catch(ex) {
        next(ex);
      }
    };  
  }
