const { Router }= require('express');
const graphqlHTTP = require('express-graphql');

const schema = require('./schema');

module.exports = graphqlHTTP({
  schema,
  graphiql: true
});
