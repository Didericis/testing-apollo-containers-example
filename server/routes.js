const { Router }= require('express');
const config = require('config');
const path = require('path');

const app = require('./app');
const graphql = require('./graphql');

module.exports = () => {
  const router = new Router();

  // server graphql schema 
  router.use('/graphql', graphql);

  // serve pages
  router.use('*', (req, res) => {
    res.render(path.resolve(__dirname, '../templates/index.html'), {
      script: '/app.js',
      styles: '/app.css',
    });
  });

  return router;
}
