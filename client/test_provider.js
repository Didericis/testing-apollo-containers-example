import React, { Component } from 'react';
import Faker from 'faker';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { MemoryRouter } from 'react-router';
import { SchemaLink } from 'apollo-link-schema';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { store } from 'redux_utils';

// NB: Import schema string instead of the schema executable so we don't 
// end up importing server related code to the client
import schemaString from 'raw-loader!../output/schema'; 
import { createClient } from 'lib/apollo_client'

// Test schema
export const schema = makeExecutableSchema({ typeDefs: schemaString });

// Default mocks
addMockFunctionsToSchema({ 
  schema,
  mocks: {
    ID: () => Faker.random.uuid(),
    String: () => Faker.lorem.sentence(),
  }
});

export default class TestProvider extends Component {
  static schema = makeExecutableSchema({ typeDefs: schemaString });
  static apolloClient = createClient({ link: new SchemaLink({ schema: TestProvider.schema }) });
  static createStore = (initialStoreState = {}) => store(initialStoreState, {
    actionHistory: (state = [], action) => [action, ...state]
  });

  store = TestProvider.createStore();

  componentWillMount() {
    const { graphqlResolver, storeState } = this.props;
    this.setStoreState(storeState);
    this.mockGraphql(graphqlResolver);
  }

  componentWillReceiveProps({ graphqlResolver, storeState }) {
    this.setStoreState(storeState);
    this.mockGraphql(graphqlMocks);
  }

  mockGraphql(mocks = {}) {
    addMockFunctionsToSchema({ 
      schema: TestProvider.schema,
      mocks 
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
          <ApolloProvider client={TestProvider.apolloClient}>
            {children}
          </ApolloProvider>
        </Provider>
      </MemoryRouter>
    );
  }
}
