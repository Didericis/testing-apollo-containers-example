const { printSchema } = require('graphql');
const fs = require('fs');
const path = require('path');

const schema = require('../server/schema');

const PATH = path.resolve(__dirname, '../output/schema');

fs.writeFile(PATH, printSchema(schema), 'utf8', (err) => {
  if (err) throw err;
  console.log('Schema written to', PATH);
});
