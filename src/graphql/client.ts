import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

export const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://rickandmortyapi.com/graphql' }),
  cache: new InMemoryCache(),
})
