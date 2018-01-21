const chai = require('chai');
const sinon = require('sinon');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

global.sandbox = sinon.sandbox.create();

afterEach(() => sandbox.restore());

//const factoryContexts = require.context('test_utils/factories', true);
//factoryContexts.keys().forEach(factoryContexts);

enzyme.configure({ adapter: new Adapter() });

const context = require.context('.', true, /.+.spec\.js$/);
context.keys().forEach(context);
