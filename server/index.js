const config = require('config');

const routes = require('./routes');
const app = require('./app');

// NB: print the schema every time the server restarts
if (process.env.NODE_ENV == 'development') require('../scripts/print_schema');

const PORT = config.get('server').port;
app(routes()).listen(PORT, () => {
  console.log('Express server running at localhost:' + PORT);
});
