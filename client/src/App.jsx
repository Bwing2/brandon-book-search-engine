import './App.css';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client/link/context';

import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';

// Instance of ApolloClient that connects to GraphQL API at /graphql.
const client = new ApolloClient({
  uri: '/graphql',
  // Recommended cache.
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
