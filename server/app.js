const express = require('express');
const bodyParser = require('body-parser');
const hoganExpress = require('hogan-express');
const config = require('config');
const path = require('path');

module.exports = (router) => {
  const app = express();

  // attach dev middleware (hmr, etc) when in development mode
  if ([undefined, 'development'].includes(process.env.NODE_ENV)) {
    require('./middleware/dev').applyWebpackMiddleware(app);
  }

  // static routes
  app.use(express.static(path.resolve(__dirname, '../public')));

  // set up basic body parsing
  app.use(bodyParser.json());

  // set up view layer
  app.set('view engine', 'html');
  app.engine('html', hoganExpress);

  // define all routes
  app.use(router);

  return app;
}
