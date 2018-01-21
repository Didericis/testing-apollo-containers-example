import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';

import client from 'lib/apollo_client'
import { store } from 'redux_utils';

export default (Component) => () =>
  <ApolloProvider client={client}>
    <Provider store={store()}>
      <Component />
    </Provider>
  </ApolloProvider>
