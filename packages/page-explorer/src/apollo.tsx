import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';

// const graphUri = 'http://localhost:8082/v1/graphql';
const graphUri = 'https://explorer.dock.io/api/v1/graphql';

const client = new ApolloClient({
  link: new HttpLink({ uri: graphUri }),
  cache: new InMemoryCache()
});

export function shouldUseDB() {
  return true;
}

export default client;
