import React, { Component } from 'react';
import Faker from 'faker';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { MemoryRouter } from 'react-router';
import { SchemaLink } from 'apollo-link-schema';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import PropTypes from 'prop-types';

// NB: Import schema string instead of the schema executable so we don't 
// end up importing server related code to the client
import schemaString from 'raw-loader!../output/schema'; 
import { createClient } from 'lib/apollo_client'
import { store } from 'redux_utils';

// Default mocks
export default class TestProvider extends Component {
  static createSchema = () => makeExecutableSchema({ typeDefs: schemaString });
  static createStore = (initialStoreState = {}) => store(initialStoreState, {
    actionHistory: (state = [], action) => [action, ...state]
  });

  static propTypes = {
    storeState: PropTypes.object,
    graphqlMocks: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.schema = TestProvider.createSchema();
    this.store = TestProvider.createStore();
    this.apolloClient = createClient({ link: new SchemaLink({ schema: this.schema }) });
    this.addDefaultMocks();
  }

  componentWillMount() {
    const { graphqlMocks, storeState } = this.props;
    this.setStoreState(storeState);
    this.mockGraphql(graphqlMocks);
  }

  componentWillReceiveProps({ graphqlMocks, storeState }) {
    this.setStoreState(storeState);
    this.mockGraphql(graphqlMocks);
  }

  addDefaultMocks() {
    addMockFunctionsToSchema({ 
      schema: this.schema,
      mocks: {
        ID: () => Faker.random.uuid(),
        String: () => Faker.lorem.sentence(),
      }
    });
  }

  mockGraphql(mocks = {}) {
    addMockFunctionsToSchema({ 
      schema: this.schema,
      mocks,
    });
  }

  setStoreState(storeState) {
    this.store = TestProvider.createStore(storeState);
  }

  getStoreState() {
    return this.store.getState();
  }

  getActions() {
   return $testProvider.getStoreState().actionHistory;
  }

  getLastAction() {
    return this.getActions()[0];
  }
  
  render() {
    const { children } = this.props;

    return (
      <MemoryRouter>
        <Provider store={this.store}>
          <ApolloProvider client={this.apolloClient}>
            {children}
          </ApolloProvider>
        </Provider>
      </MemoryRouter>
    );
  }
}
