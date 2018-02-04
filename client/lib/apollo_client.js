import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

export const createClient = (options = {}) => new ApolloClient({
  link: new HttpLink({ 
    uri: '/graphql', 
  }),
  cache: new InMemoryCache(),
  opts: {
    fetchPolicy: 'cache-and-network',
  },
  ...options
});

export default createClient();
