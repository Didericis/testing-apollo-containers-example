const config = require('config');

const routes = require('./routes');
const app = require('./app');

const PORT = config.get('server').port;
app(routes()).listen(PORT, () => {
  console.log('Express server running at localhost:' + PORT);
});
