const logger = require('../services/logger');

// Middleware
function loggerMiddleware(req, res, next) {
  logger.info(`${req.method} request on ${req.path}
    Queries: ${JSON.stringify(req.query)}
    Params: ${JSON.stringify(req.params)}
    Body: ${JSON.stringify(req.body)}`);
  next();
}

module.exports = loggerMiddleware;
