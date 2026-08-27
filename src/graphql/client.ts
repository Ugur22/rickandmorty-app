import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'
import { RetryLink } from '@apollo/client/link/retry'

// Public API rate-limits aggressively; a 429 shows up as a generic CORS-looking
// "Failed to fetch" since the error response carries no CORS headers.
const retryLink = new RetryLink({
  delay: { initial: 500, max: 5000, jitter: true },
  attempts: { max: 5 },
})

export const client = new ApolloClient({
  link: ApolloLink.from([retryLink, new HttpLink({ uri: 'https://rickandmortyapi.com/graphql' })]),
  cache: new InMemoryCache(),
})
